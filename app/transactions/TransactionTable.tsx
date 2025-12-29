import type { Transaction } from '@/lib/supabase/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TransactionsResponse } from '@/api/transactions/route';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
} from '@heroui/react';
import { useMemo, useState } from 'react';

import useRenderCell from '@/transactions/useRenderCell';
import { useCallback } from 'react';

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
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('page_size', perPage);
      url.searchParams.append('start_date', filterDateRange.start);
      url.searchParams.append('end_date', filterDateRange.end);
      const response = await fetch(url.href);
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  const { data: transactionResponse, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ['transactions', currentPage, filterYear, perPage],
    queryFn: fetchTransactions,
    enabled: !editable,
    placeholderData: keepPreviousData,
  });

  const totalEntries = useMemo(() => {
    return transactions ? transactions.length : transactionResponse?.meta.total_count || 0;
  }, [transactions, transactionResponse?.meta]);

  const totalPages = useMemo(() => {
    const totalEntries = transactionResponse?.meta.total_count || 0;
    return Math.ceil(totalEntries / parseInt(perPage));
  }, [transactionResponse?.meta, perPage]);

  const renderCell = useRenderCell();

  const handleUpdateData = useCallback(
    (rowId: string, rowData?: Partial<Transaction>) => {
      if (onUpdateData) onUpdateData(rowId, rowData);
    },
    [onUpdateData]
  );

  function TopContent() {
    const yearFilterOptions = [
      { key: '2026', label: '2026' },
      { key: '2025', label: '2025' },
      { key: '2024', label: '2024' },
    ];

    return (
      <section className="flex justify-end">
        <Select
          className="max-w-xs"
          items={yearFilterOptions}
          selectedKeys={[filterYear]}
          label="Year"
          onChange={(event) => setFilterYear(event.target.value)}
        >
          {(year) => <SelectItem>{year.label}</SelectItem>}
        </Select>
      </section>
    );
  }

  const BottomContent =
    currentPage && totalPages ? (
      <div className="w-full flex justify-between items-center pt-6 border-t border-neutral-200">
        <p>
          Total: <strong>{totalEntries}</strong> transactions
        </p>
        <div className="flex gap-4 flex-1 justify-end items-center">
          {/* Page Size Controls */}
          <Select
            className="max-w-20"
            size="sm"
            items={[
              { key: '25', label: '25' },
              { key: '50', label: '50' },
              { key: '100', label: '100' },
            ]}
            selectedKeys={[perPage]}
            onChange={(event) => setPerPage(event.target.value)}
          >
            {(option) => <SelectItem>{option.label}</SelectItem>}
          </Select>
          <Pagination
            showControls
            size="sm"
            page={currentPage}
            total={totalPages}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    ) : null;

  return (
    <Table
      aria-label="Transaction Data Table"
      topContent={TopContent()}
      bottomContent={BottomContent}
      shadow="none"
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
        items={transactions && editable ? transactions : transactionResponse?.data || []}
        emptyContent="Upload your trasactions to view and modify them."
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
