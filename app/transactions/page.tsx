'use client';
import Link from 'next/link';
import TransactionTable from '@/transactions/TransactionTable';
import { Suspense } from 'react';
import { PrivacyButton } from '@/lib/components/PrivacyButton';

export default function TransactionPage() {
  return (
    <div className="flex flex-col h-full pb-8">
      {/* Page Title Bar */}
      <section className="flex justify-between items-center py-8 pt-0 flex-none">
        <h2 className="font-semibold text-2xl">Transactions</h2>
        <div className="flex items-center gap-2">
          <PrivacyButton />
          <Link href="/transactions/new" className="button button--sm button--primary">
            Add Transactions
          </Link>
        </div>
      </section>
      <div className="flex-1 overflow-hidden flex flex-col">
        <Suspense fallback={<p>Unable to load transactions.</p>}>
          <TransactionTable />
        </Suspense>
      </div>
    </div>
  );
}
