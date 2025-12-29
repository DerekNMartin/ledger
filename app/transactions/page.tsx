'use client';

import Link from 'next/link';
import TransactionTable from '@/transactions/TransactionTable';
import { Button } from '@heroui/react';

export default function TransactionNew() {
  return (
    <main className="flex flex-col h-[calc(100vh-113px)] overflow-hidden">
      {/* Page Title Bar */}
      <section className="flex justify-between items-center border-b border-neutral-200 p-6 pt-0 flex-none">
        <h2 className="font-bold text-2xl">Transactions</h2>
        <Link href="/transactions/new">
          <Button color="primary">Import Transactions</Button>
        </Link>
      </section>
      <div className="flex-1 overflow-hidden flex flex-col">
        <TransactionTable />
      </div>
    </main>
  );
}
