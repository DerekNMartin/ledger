/**
 * TODO
 * - Bug: Prevent propagation on input
 * - Add a way to remove transactions
 * - Add an indicator if an transaction has been modified
 */

'use client';

import type { Transaction } from '@/lib/supabase/types';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Checkbox } from '@heroui/react';

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
    <main className="flex flex-col gap-8 p-6">
      <section className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Upload Transactions</h2>
      </section>
      <section className="flex flex-col gap-4 border-b border-neutral-200 pb-6">
        <TransactionUpload onUpload={setTransactionData} />
        <Checkbox
          className="self-end"
          isSelected={enableApplyAll}
          onValueChange={setEnableApplyAll}
        >
          Apply to similar transactions
        </Checkbox>
      </section>
      <TransactionTable transactions={transactionData} onUpdateData={updateData} editable />
      <section className="w-full flex justify-end">
        <Button color="primary" onPress={handleSaveTransactions} disabled={!transactionData}>
          Save Transactions
        </Button>
      </section>
    </main>
  );
}
