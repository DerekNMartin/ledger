'use client';

import type { Transaction } from './api/transactions/route';
import { useState } from 'react';
import TransactionTable from './components/TransactionTable';
import TransactionUpload from './components/TransactionUpload';

export default function Home() {
  const [transactionData, setTransactionData] = useState<Transaction[]>();

  return (
    <main className="flex flex-col gap-8 p-6">
      <TransactionUpload onUpload={setTransactionData} />
      <TransactionTable data={transactionData} />
    </main>
  );
}
