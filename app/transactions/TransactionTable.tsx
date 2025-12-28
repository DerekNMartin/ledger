import type { Transaction } from '@/lib/supabase/types';

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
} from '@heroui/react';

import useRenderCell from '@/transactions/useRenderCell';
import { useCallback } from 'react';

export interface TransactionTableProps {
  transactions?: Transaction[];
  editable?: boolean;
  currentPage?: number;
  totalPages?: number;
  onChangePage?: (pageNum?: number) => void;
  onUpdateData?: (rowId: string, rowData?: Partial<Transaction>) => void;
}

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
  {
    transactions,
    editable,
    currentPage,
    totalPages,
    onChangePage,
    onUpdateData,
  }: TransactionTableProps = { editable: false }
) {
  const renderCell = useRenderCell();

  const handleUpdateData = useCallback(
    (rowId: string, rowData?: Partial<Transaction>) => {
      if (onUpdateData) onUpdateData(rowId, rowData);
    },
    [onUpdateData]
  );

  const TablePagination =
    currentPage && totalPages && onChangePage ? (
      <div className="flex w-full justify-end border-t border-neutral-200 pt-4">
        <Pagination
          showControls
          page={currentPage}
          total={totalPages}
          onChange={(page) => onChangePage(page)}
        />
      </div>
    ) : null;

  return (
    <Table
      aria-label="Transaction Data Table"
      bottomContent={TablePagination}
      shadow="none"
      className="border border-neutral-200 rounded-xl"
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
        items={transactions || []}
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
