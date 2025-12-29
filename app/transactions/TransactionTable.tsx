import type { Transaction } from '@/lib/supabase/types';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { TransactionsResponse } from '@/api/transactions/route';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/react';
import { useMemo, useState, useCallback } from 'react';

import { TransactionTableBottomContent } from '@/lib/components/TransactionTable/BottomContent';
import { TransactionTableTopContent } from '@/lib/components/TransactionTable/TopContent';

import useRenderCell from '@/transactions/useRenderCell';

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

  return (
    <Table
      classNames={{
        base: 'flex-1 overflow-hidden', // The outer container
        wrapper: 'flex-1 overflow-auto', // The actual scrollable area for <tbody>
      }}
      isHeaderSticky
      aria-label="Transaction Data Table"
      radius="none"
      shadow="none"
      isStriped
      topContentPlacement="outside"
      bottomContentPlacement="outside"
      topContent={
        <TransactionTableTopContent selectedYear={filterYear} onYearChange={setFilterYear} />
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
