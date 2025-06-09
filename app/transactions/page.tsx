'use client';

import type { Transaction } from '@/api/transactions/upload/route';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import TransactionTable from '@/components/TransactionTable';

export default function TransactionNew() {
  const [transactionData, setTransactionData] = useState<Transaction[]>();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const transactions = (await response.json()) as Transaction[];
        setTransactionData(transactions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="flex flex-col gap-8 p-6">
      <section className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Transactions</h2>
        <Link href="/transactions/new">
          <Button color="primary">Import Transactions</Button>
        </Link>
      </section>
      <TransactionTable data={transactionData} />
    </main>
  );
}
