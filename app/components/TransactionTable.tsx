import type { Transaction } from '../api/transactions/route';
import type { SharedSelection } from '@heroui/system';

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';
import { Input, Switch } from '@heroui/react';
import CategorySelect from './CategorySelect';
import AccountSelect from './AccountSelect';

export interface TransactionTableProps {
  data?: Transaction[];
  onUpdateData?: (rowIndex: number, rowData?: Partial<Transaction>) => void;
}

export default function dataTable({ data, onUpdateData }: TransactionTableProps) {
  if (!data) return;

  function handleCategoryUpdate(selection: SharedSelection, rowIndex: number) {
    if (onUpdateData) onUpdateData(rowIndex, { category: selection.currentKey });
  }

  function handleNameUpdate(value: string, rowIndex: number) {
    if (onUpdateData) onUpdateData(rowIndex, { name: value });
  }

  function handleAccountUpdate(selection: SharedSelection, rowIndex: number) {
    if (onUpdateData) onUpdateData(rowIndex, { account: selection.currentKey });
  }

  function handleReoccuringUpdate(isSelected: boolean, rowIndex: number) {
    if (onUpdateData) onUpdateData(rowIndex, { isReoccuring: isSelected });
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
            selectedKeys={[row.account || '']}
            onSelectionChange={(selection) => handleAccountUpdate(selection, index)}
          />
        </TableCell>
        <TableCell>
          <Input
            className="min-w-44"
            variant="bordered"
            placeholder="Transaction name"
            value={row.name || ''}
            onValueChange={(value) => handleNameUpdate(value, index)}
          />
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{formatCurrency(row.amount)}</TableCell>
        <TableCell className="flex justify-end">
          <CategorySelect
            className="w-44"
            selectedKeys={[row.category || '']}
            onSelectionChange={(selection) => handleCategoryUpdate(selection, index)}
          />
        </TableCell>
        <TableCell>
          <Switch
            color="primary"
            isSelected={row.isReoccuring}
            onValueChange={(isSelected) => handleReoccuringUpdate(isSelected, index)}
            aria-label="Reoccuring payment"
          />
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Table aria-label="Transaction Data Table" selectionMode="single">
      <TableHeader>{headers}</TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
}
