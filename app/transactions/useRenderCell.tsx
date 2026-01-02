'use client';

import { Transaction } from '@/lib/supabase/types';
import { Button, Input, Switch } from '@heroui/react';
import CategorySelect, { CATEGORIES } from '@/lib/components/CategorySelect';
import AccountSelect from '@/lib/components/AccountSelect';

import { useCallback } from 'react';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAccounts } from '@/lib/hooks/useAccounts';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
}

function formatDate(dateInput: string) {
  // Extract the date part (YYYY-MM-DD) from the ISO string
  const datePart = dateInput.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);

  // Note: month is 0-indexed in JS (January is 0)
  const fullDate = new Date(year, month - 1, day);

  return fullDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

function reverseNumSignButton(amount: number, callback: (amount: number) => void) {
  const isPositive = amount >= 0;
  return (
    <Button
      onPress={() => callback(-amount)}
      variant="flat"
      className="w-6 h-6 aspect-square min-w-6 p-1 ml-2 text-xs font-bold"
      isIconOnly={true}
    >
      {isPositive ? (
        <MinusIcon className="w-full h-full" />
      ) : (
        <PlusIcon className="w-full h-full" />
      )}
    </Button>
  );
}

export default function useRenderCell() {
  const { accounts } = useAccounts();
  return useCallback(
    (
      transaction: Transaction,
      columnKey: React.Key,
      editable?: boolean,
      onUpdateData?: (rowData?: Partial<Transaction>) => void
    ) => {
      const cellValue = transaction[columnKey as keyof Transaction];

      function handleUpdateData(rowData?: Partial<Transaction>) {
        if (onUpdateData) onUpdateData(rowData);
      }

      switch (columnKey) {
        case 'date':
          return formatDate(transaction.date);
        case 'account_id':
          return editable ? (
            <AccountSelect
              accounts={accounts}
              disabled={!editable}
              selectedKeys={[transaction.account_id?.toString() || '']}
              onSelectionChange={(selection) =>
                handleUpdateData({ account_id: Number(selection.currentKey) })
              }
            />
          ) : (
            accounts?.find(({ id }) => id === transaction.account_id)?.name ||
              transaction.account_id
          );
        case 'name':
          return editable ? (
            <Input
              key={transaction.name || transaction.id} // Ensure input is re-rendered when name changes
              className="min-w-44"
              variant="bordered"
              placeholder="Transaction name"
              defaultValue={transaction.name || ''}
              onBlur={(event) => {
                event.preventDefault();
                handleUpdateData({ name: event.target.value });
              }}
            />
          ) : (
            <p className="font-bold">{transaction.name}</p>
          );
        case 'amount':
          return (
            <span
              className={[
                'flex items-center justify-end font-bold',
                ...((transaction.amount > 0 && ['text-green-600']) || []),
              ].join(' ')}
            >
              {formatCurrency(transaction.amount)}
              {editable &&
                reverseNumSignButton(transaction.amount, (amount) => handleUpdateData({ amount }))}
            </span>
          );
        case 'category':
          return editable ? (
            <CategorySelect
              className="min-w-44"
              selectedKeys={[transaction.category || '']}
              onSelectionChange={(selection) =>
                handleUpdateData({ category: selection.currentKey })
              }
            />
          ) : (
            CATEGORIES.find((cat) => cat.key === transaction.category)?.label ||
              transaction.category
          );
        case 'is_reoccuring':
          return editable ? (
            <Switch
              color="primary"
              isSelected={transaction.is_reoccuring}
              onValueChange={(isSelected) => handleUpdateData({ is_reoccuring: isSelected })}
              aria-label="Reoccuring payment"
            />
          ) : transaction.is_reoccuring ? (
            'Yes'
          ) : (
            'No'
          );
        default:
          return cellValue;
      }
    },
    [accounts]
  );
}
