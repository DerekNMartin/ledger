'use client';

import Link from 'next/link';
import TransactionTable from '@/transactions/TransactionTable';
import { Button } from '@heroui/react';

export default function TransactionPage() {
  return (
    <div className="flex flex-col h-full pb-8">
      {/* Page Title Bar */}
      <section className="flex justify-between items-center py-8 pt-0 flex-none">
        <h2 className="font-semibold text-2xl">Transactions</h2>
        <Link href="/transactions/new">
          <Button variant="primary" size="sm">
            Add Transactions
          </Button>
        </Link>
      </section>
      <div className="flex-1 overflow-hidden flex flex-col">
        <TransactionTable />
      </div>
    </div>
  );
}
