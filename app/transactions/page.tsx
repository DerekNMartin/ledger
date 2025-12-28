'use client';

import Link from 'next/link';
import TransactionTable from '@/transactions/TransactionTable';
import { Button } from '@heroui/react';

export default function TransactionNew() {
  return (
    <main className="flex flex-col">
      <section className="flex justify-between items-center border-b border-neutral-200 p-6 pt-0">
        <h2 className="font-bold text-2xl">Transactions</h2>
        <Link href="/transactions/new">
          <Button color="primary">Import Transactions</Button>
        </Link>
      </section>
      <TransactionTable />
    </main>
  );
}
