'use client';

import type { Transaction } from '@/api/transactions/upload/route';
import Link from 'next/link';
import { Button } from '@heroui/react';

export default function TransactionNew() {
  // Fetch Transactions

  return (
    <main className="flex flex-col gap-8 p-6">
      <section className="flex justify-end">
        <Link href="/transactions/new">
          <Button color="primary">Import Transactions</Button>
        </Link>
      </section>
      Transactions table here.
      {/* <TransactionTable data={transactionData} onUpdateData={updateData} /> */}
    </main>
  );
}
