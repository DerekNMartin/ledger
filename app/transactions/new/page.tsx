/**
 * TODO
 * - Bug: Prevent propagation on input
 * - Add a way to remove transactions
 * - Add an indicator if an transaction has been modified
 */

'use client';

import type { Transaction } from '@/lib/supabase/types';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Checkbox, Label } from '@heroui/react';

import TransactionTable from '@/transactions/TransactionTable';
import TransactionUpload from '@/transactions/new/TransactionUpload';

export default function TransactionsNew() {
  const router = useRouter();

  const [transactionData, setTransactionData] = useState<Transaction[]>();

  const [enableApplyAll, setEnableApplyAll] = useState(true);

  // TODO: Display number of items changed
  function updateData(rowId: string, dataItem?: Partial<Transaction>) {
    if (!transactionData?.length) return;
    setTransactionData((prev) => {
      const rowItem = prev?.find((row) => row.id === rowId);
      return prev?.map((row) => {
        // If enableApplyAll, apply changes to all rows with the same description
        if (row.id === rowId || (enableApplyAll && row.description === rowItem?.description)) {
          return { ...row, ...dataItem };
        }
        return row;
      });
    });
  }

  async function handleSaveTransactions() {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({ transactions: transactionData }),
      });

      if (response.ok) router.push('/transactions');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <section className="flex justify-between items-center flex-none py-6 pt-0">
        <h2 className="font-semibold text-2xl">Upload Transactions</h2>
      </section>

      <section className="flex gap-4 pb-6 flex-none justify-end">
        <TransactionUpload onUpload={setTransactionData} />
      </section>

      <section className="w-full flex justify-between items-center py-6">
        <Checkbox
          id="apply-similar"
          className="self-end"
          isSelected={enableApplyAll}
          onChange={setEnableApplyAll}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="apply-similar">Apply changes to similar transactions</Label>
          </Checkbox.Content>
        </Checkbox>
        <Button variant="primary" onPress={handleSaveTransactions} isDisabled={!transactionData}>
          Save Transactions
        </Button>
      </section>

      <section className="h-full pb-8">
        <Suspense fallback={<p>Unable to load transactions.</p>}>
          <TransactionTable transactions={transactionData} onUpdateData={updateData} editable />
        </Suspense>
      </section>
    </div>
  );
}
