import type { Transaction } from '@/api/transactions/upload/route';

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';
import { Input, Switch } from '@heroui/react';

import CategorySelect from '@/lib/components/CategorySelect';
import AccountSelect from '@/lib/components/AccountSelect';
import { useState } from 'react';

export interface TransactionTableProps {
  data?: Transaction[];
  editable?: boolean;
  onUpdateData?: (rowIndex: number, rowData?: Partial<Transaction>) => void;
}

export default function TransactionTable(
  { data, editable, onUpdateData }: TransactionTableProps = { editable: false }
) {
  if (!data) return;

  function handleUpdateData(rowIndex: number, rowData?: Partial<Transaction>) {
    if (onUpdateData) onUpdateData(rowIndex, rowData);
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
  }

  const headers = [
    'date',
    'account',
    'name',
    'description',
    'amount',
    'category',
    'reoccuring',
  ].map((header, index) => (
    <TableColumn
      key={index}
      className="capitalize"
      align={['amount', 'category', 'reoccuring'].includes(header) ? 'end' : 'start'}
    >
      {header}
    </TableColumn>
  ));

  const rows = data.map((row, index) => {
    const date = new Date(row.date);
    return (
      <TableRow key={row.id}>
        <TableCell>{date.toLocaleDateString()}</TableCell>
        <TableCell>
          <AccountSelect
            disabled={!editable}
            selectedKeys={[row.account_id?.toString() || '']}
            onSelectionChange={(selection) =>
              handleUpdateData(index, { account_id: Number(selection.currentKey) })
            }
          />
        </TableCell>
        <TableCell>
          {editable ? (
            <Input
              className="min-w-44"
              variant="bordered"
              placeholder="Transaction name"
              value={row.name || ''}
              onValueChange={(value) => handleUpdateData(index, { name: value })}
            />
          ) : (
            row.name
          )}
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{formatCurrency(row.amount)}</TableCell>
        <TableCell className="flex justify-end">
          {editable ? (
            <CategorySelect
              className="w-44"
              selectedKeys={[row.category || '']}
              onSelectionChange={(selection) =>
                handleUpdateData(index, { category: selection.currentKey })
              }
            />
          ) : (
            row.category
          )}
        </TableCell>
        <TableCell>
          {editable ? (
            <Switch
              color="primary"
              isSelected={row.is_reoccuring}
              onValueChange={(isSelected) => handleUpdateData(index, { is_reoccuring: isSelected })}
              aria-label="Reoccuring payment"
            />
          ) : row.is_reoccuring ? (
            'Yes'
          ) : (
            'No'
          )}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Table aria-label="Transaction Data Table">
      <TableHeader>{headers}</TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
}
