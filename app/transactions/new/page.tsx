'use client';

import type { Transaction } from '@/api/transactions/upload/route';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@heroui/react';

import TransactionTable from '@/transactions/TransactionTable';
import TransactionUpload from '@/transactions/new/TransactionUpload';

export default function TransactionsNew() {
  const router = useRouter();

  const [transactionData, setTransactionData] = useState<Transaction[]>();

  function updateData(rowIndex: number, dataItem?: Partial<Transaction>) {
    if (!transactionData?.length) return;
    setTransactionData((prev) => {
      return prev?.map((row, index) => (index === rowIndex ? { ...row, ...dataItem } : row));
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
      <TransactionUpload onUpload={setTransactionData} />
      <TransactionTable data={transactionData} onUpdateData={updateData} editable />
      <footer className="w-full flex justify-end">
        {transactionData && (
          <Button color="primary" onPress={handleSaveTransactions}>
            Save Transactions
          </Button>
        )}
      </footer>
    </main>
  );
}
