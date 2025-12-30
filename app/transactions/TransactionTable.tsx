import type { Transaction } from '@/lib/supabase/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TransactionsResponse } from '@/api/transactions/route';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/react';
import { useMemo, useState, useCallback } from 'react';

import { TransactionTableBottomContent } from '@/lib/components/TransactionTable/BottomContent';
import { TransactionTableTopContent } from '@/lib/components/TransactionTable/TopContent';

import useRenderCell from '@/transactions/useRenderCell';
import { useDebounce } from '@/lib/hooks/useDebounce';

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
  { name: 'Amount', id: 'amount' },
  { name: 'Category', id: 'category' },
  { name: 'Reoccuring', id: 'is_reoccuring' },
];

export default function TransactionTable(
  { transactions, editable, onUpdateData }: TransactionTableProps = { editable: false }
) {
  const renderCell = useRenderCell();

  const [isDownload, setIsDownload] = useState(false);
  // Search
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState('25');
  // Year Filter
  const [filterYear, setFilterYear] = useState('2025');

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
    queryKey: ['transactions', currentPage, filterYear, perPage, debouncedSearch, isDownload],
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

  /** ------ Edit Table Logic ----- */

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

  return (
    <Table
      classNames={{
        base: 'flex-1 overflow-hidden', // The outer container
        wrapper: 'flex-1 overflow-auto', // The actual scrollable area for <tbody>
      }}
      isHeaderSticky
      aria-label="Transaction Data Table"
      shadow="none"
      isStriped
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      topContent={
        <TransactionTableTopContent
          selectedYear={filterYear}
          onYearChange={setFilterYear}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onDownloadClick={() => setIsDownload(true)}
        />
      }
      bottomContent={
        <TransactionTableBottomContent
          totalEntries={totalEntries}
          perPage={perPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
        />
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.id}
            className="capitalize"
            align={['amount', 'category', 'is_reoccuring'].includes(column.id) ? 'end' : 'start'}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={transactions && editable ? filteredTransactions : transactionResponse?.data || []}
        emptyContent={
          searchValue
            ? 'No matching transactions found.'
            : 'Upload your trasactions to view and modify them.'
        }
      >
        {(transaction) => (
          <TableRow key={transaction.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(transaction, columnKey, editable, (rowData) =>
                  handleUpdateData(transaction.id || '', rowData)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
