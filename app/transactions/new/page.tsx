'use client';

import type { Transaction } from '@/api/transactions/upload/route';

import { useState } from 'react';

import { Button } from '@heroui/react';

import TransactionTable from '@/components/TransactionTable';
import TransactionUpload from '@/components/TransactionUpload';

export default function TransactionsNew() {
  const [transactionData, setTransactionData] = useState<Transaction[]>();

  function updateData(rowIndex: number, dataItem?: Partial<Transaction>) {
    if (!transactionData?.length) return;
    setTransactionData(
      transactionData.map((row, index) => (index === rowIndex ? { ...row, ...dataItem } : row))
    );
  }

  return (
    <main className="flex flex-col gap-8 p-6">
      <TransactionUpload onUpload={setTransactionData} />
      <TransactionTable data={transactionData} onUpdateData={updateData} />
      <footer className="w-full flex justify-end">
        {transactionData && <Button color="primary">Save Transactions</Button>}
      </footer>
    </main>
  );
}
