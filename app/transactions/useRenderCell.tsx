'use client';

import { Transaction } from '@/lib/supabase/types';
import { Button, Input, Switch } from '@heroui/react';
import CategorySelect from '@/lib/components/CategorySelect';
import AccountSelect from '@/lib/components/AccountSelect';

import { useCallback } from 'react';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(value);
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
          return new Date(transaction.date).toLocaleDateString();
        case 'account_id':
          return (
            <AccountSelect
              disabled={!editable}
              selectedKeys={[transaction.account_id?.toString() || '']}
              onSelectionChange={(selection) =>
                handleUpdateData({ account_id: Number(selection.currentKey) })
              }
            />
          );
        case 'name':
          return editable ? (
            <Input
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
            transaction.name
          );
        case 'amount':
          return (
            <span
              className={[
                'flex items-center justify-end font-bold',
                ...((transaction.amount < 0 && ['text-red-600 font-normal']) || []),
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
    []
  );
}
