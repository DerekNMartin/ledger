import type { Transaction } from '@/api/transactions/upload/route';

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';

import useRenderCell from '@/transactions/useRenderCell';
import { useCallback } from 'react';

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
  if (!transactions) return;

  const handleUpdateData = useCallback((rowId: string, rowData?: Partial<Transaction>) => {
    if (onUpdateData) onUpdateData(rowId, rowData);
  }, []);

  const renderCell = useRenderCell();

  return (
    <Table aria-label="Transaction Data Table">
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
      <TableBody items={transactions}>
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
