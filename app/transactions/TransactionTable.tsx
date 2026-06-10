import type { Transaction } from '@/lib/supabase/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TransactionsResponse } from '@/api/transactions/route';
import { Table } from '@heroui/react';
import { useMemo, useState, useCallback } from 'react';
import { useAccounts } from '@/lib/hooks/useAccounts';

import { TransactionTableBottomContent } from '@/lib/components/TransactionTable/BottomContent';
import { TransactionTableTopContent } from '@/lib/components/TransactionTable/TopContent';

import { TransactionTableCell } from '@/lib/components/TransactionTable/TransactionTableCell';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useUrlState } from '@/lib/hooks/useUrlState';
import { TransactionsSummary } from '@/lib/components/TransactionTable/TransactionsSummary';

export type TransactionTableProps = {
  editable?: boolean;
  transactions?: Transaction[];
  onUpdateData?: (rowId: string, rowData?: Partial<Transaction>) => void;
};

const columns: { name: string; id: keyof Partial<Transaction> }[] = [
  { name: 'Date', id: 'date' },
  { name: 'Account', id: 'account_id' },
  { name: 'Name', id: 'name' },
  { name: 'Description', id: 'description' },
  { name: 'Category', id: 'category' },
  { name: 'Reoccuring', id: 'is_reoccuring' },
  { name: 'Amount', id: 'amount' },
];

export default function TransactionTable(
  { transactions, editable, onUpdateData }: TransactionTableProps = { editable: false }
) {
  const { accounts } = useAccounts();

  const [isDownload, setIsDownload] = useState(false);
  // Search
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState('25');
  // Year Filter
  const [filterYear, setFilterYear] = useUrlState('year', '2025');
  // Category Filter
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const filterDateRange = useMemo(() => {
    return {
      start: `${filterYear}-01-01`,
      end: `${filterYear}-12-31`,
    };
  }, [filterYear]);

  async function fetchTransactions() {
    try {
      const baseUrl = window.location.origin;
      const url = new URL('/api/transactions', baseUrl);
      if (searchValue) url.searchParams.append('search', debouncedSearch);
      if (isDownload) url.searchParams.append('download', 'true');
      if (categoryFilter.length > 0) url.searchParams.append('category', categoryFilter.join(','));
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('page_size', perPage);
      url.searchParams.append('start_date', filterDateRange.start);
      url.searchParams.append('end_date', filterDateRange.end);
      const response = await fetch(url.href);

      if (isDownload) {
        // If downloading, handle the response as a file
        const blob = await response.blob(); // Convert response to a Blob
        const downloadUrl = window.URL.createObjectURL(blob); // Create a URL for the Blob
        const link = document.createElement('a'); // Create an <a> element
        link.href = downloadUrl;
        link.download = 'transactions.csv'; // Set the filename
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM
        window.URL.revokeObjectURL(downloadUrl); // Revoke the Blob URL
        setIsDownload(false); // Reset the download state
        return null; // Query data cannot be undefined
      }

      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  const { data: transactionResponse, isLoading } = useQuery<TransactionsResponse>({
    queryKey: [
      'transactions',
      currentPage,
      filterYear,
      perPage,
      debouncedSearch,
      isDownload,
      categoryFilter,
    ],
    queryFn: fetchTransactions,
    enabled: !editable,
    placeholderData: keepPreviousData,
  });

  const totalEntries = useMemo(() => {
    return transactions ? transactions.length : transactionResponse?.meta.total_count || 0;
  }, [transactions, transactionResponse?.meta]);

  const totalPages = useMemo(() => {
    if (editable && transactions) {
      return Math.ceil(transactions.length / parseInt(perPage));
    }
    const totalEntries = transactionResponse?.meta.total_count || 0;
    return Math.ceil(totalEntries / parseInt(perPage));
  }, [transactionResponse?.meta, perPage, transactions, editable]);

  /**
   * ---------------------
   * Edit Table Logic
   * --------------------
   */

  /**
   * Filters transactions based on search value, date range, and pagination.
   * Only used when `editable` is true.
   */
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((transaction) => {
      // search filtering
      const matchesSearch = debouncedSearch
        ? Object.values(transaction).some((value) =>
            String(value).toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        : true;

      // date range filtering
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      const withinDateRange = transactionDate >= startDate && transactionDate <= endDate;

      // current page filtering
      const startIndex = (currentPage - 1) * parseInt(perPage);
      const endIndex = startIndex + parseInt(perPage);
      const index = transactions.indexOf(transaction);
      const withinCurrentPage = index >= startIndex && index < endIndex;

      return matchesSearch && withinDateRange && withinCurrentPage;
    });
  }, [transactions, debouncedSearch, filterDateRange, perPage, currentPage]);

  const handleUpdateData = useCallback(
    (rowId: string, rowData?: Partial<Transaction>) => {
      if (onUpdateData) onUpdateData(rowId, rowData);
    },
    [onUpdateData]
  );

  function handleFilterChange(filters: Record<string, string[]>) {
    // Currently only category filter is implemented
    // Can be extended to other filters as needed
    const categoryFilters = filters['category'] || [];
    if (categoryFilters.length > 0) {
      setCategoryFilter(categoryFilters);
      // Note: This filtering does not affect pagination in editable mode
      // For simplicity, we just update the current page to 1
      setCurrentPage(1);
    } else {
      setCategoryFilter([]);
    }
  }

  return (
    <>
      {transactionResponse && !editable && (
        <TransactionsSummary summary={transactionResponse?.summary} />
      )}
      <Table
        aria-label="Transaction Data Table"
        className="flex flex-col w-full flex-1 min-h-0 h-full bg-neutral-100"
      >
        <TransactionTableTopContent
          selectedYear={filterYear}
          onYearChange={setFilterYear}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onDownloadClick={() => setIsDownload(true)}
          onFilterChange={(filters) => {
            handleFilterChange(filters);
          }}
        />
        <Table.ScrollContainer className={'flex-1'}>
          <Table.Content className="h-full">
            <Table.Header columns={columns} className={'bg-neutral-100 sticky top-0 z-10'}>
              {(column) => (
                <Table.Column
                  isRowHeader={true}
                  id={column.id}
                  className={column.id === 'amount' ? 'text-right' : 'text-left'}
                >
                  {column.name}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body
              items={
                transactions && editable ? filteredTransactions : transactionResponse?.data || []
              }
              renderEmptyState={() => (
                <div className="flex justify-center items-center">
                  <p>
                    {searchValue || categoryFilter.length > 0
                      ? 'No matching transactions found.'
                      : 'Upload your trasactions to view and modify them.'}
                  </p>
                </div>
              )}
            >
              {(transaction) => (
                <Table.Row id={transaction.id} className={'h-auto'}>
                  {columns.map((column) => (
                    <Table.Cell key={column.id} className={'rounded-none h-auto'}>
                      <TransactionTableCell
                        transaction={transaction}
                        columnKey={column.id}
                        editable={editable}
                        accounts={accounts}
                        onUpdateData={(rowData) => handleUpdateData(transaction.id || '', rowData)}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <Table.Footer>
          <TransactionTableBottomContent
            totalEntries={totalEntries}
            perPage={perPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
          />
        </Table.Footer>
      </Table>
    </>
  );
}
