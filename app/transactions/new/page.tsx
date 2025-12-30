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
    <main className="flex flex-col h-[calc(100vh-113px)] overflow-hidden">
      <section className="flex justify-between items-center flex-none p-6 pt-0 border-b border-neutral-200">
        <h2 className="font-bold text-2xl">Upload Transactions</h2>
      </section>
      <section className="flex flex-col gap-4 border-b border-neutral-200 p-6 flex-none">
        <TransactionUpload onUpload={setTransactionData} />
      </section>
      <TransactionTable transactions={transactionData} onUpdateData={updateData} editable />
      <section className="w-full flex justify-between items-center p-6 border-t border-neutral-200">
        <Checkbox
          className="self-end"
          isSelected={enableApplyAll}
          onValueChange={setEnableApplyAll}
        >
          Apply changes to similar transactions
        </Checkbox>
        <Button color="primary" onPress={handleSaveTransactions} disabled={!transactionData}>
          Save Transactions
        </Button>
      </section>
    </main>
  );
}
