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
import { useState, useCallback, useMemo } from 'react';

export interface TransactionTableProps {
  transactions?: Transaction[];
  editable?: boolean;
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
  { transactions, editable, onUpdateData }: TransactionTableProps = { editable: false }
) {
  const renderCell = useRenderCell();

  const handleUpdateData = useCallback(
    (rowId: string, rowData?: Partial<Transaction>) => {
      if (onUpdateData) onUpdateData(rowId, rowData);
    },
    [onUpdateData]
  );

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const pages = Math.ceil(transactions?.length || 0 / rowsPerPage);

  const viewableTransactions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return transactions?.slice(start, end);
  }, [page, transactions]);

  const TablePagination = (
    <div className="flex w-full justify-end border-t border-neutral-200 pt-4">
      <Pagination showControls page={page} total={pages} onChange={(page) => setPage(page)} />
    </div>
  );

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
      <TableBody items={viewableTransactions}>
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
