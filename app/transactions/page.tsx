'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import TransactionTable from '@/transactions/TransactionTable';
import { TransactionsResponse } from '@/api/transactions/route';
import { useQuery } from '@tanstack/react-query';

const PAGE_SIZE = 20;

export default function TransactionNew() {
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchTransactions() {
    try {
      const baseUrl = window.location.origin;
      const url = new URL('/api/transactions', baseUrl);
      url.searchParams.append('page', currentPage.toString());
      const response = await fetch(url.href);
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }

  const { data: transactionResponse, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ['transactions', currentPage],
    queryFn: fetchTransactions,
  });

  const totalPages = useMemo(() => {
    const totalEntries = transactionResponse?.meta.total_count || 0;
    return Math.ceil(totalEntries / PAGE_SIZE);
  }, [transactionResponse?.meta]);

  return (
    <main className="flex flex-col gap-8 p-6">
      <section className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Transactions</h2>
        <Link href="/transactions/new">
          <Button color="primary">Import Transactions</Button>
        </Link>
      </section>
      <TransactionTable
        transactions={transactionResponse?.data}
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={(page) => setCurrentPage(page || 1)}
      />
    </main>
  );
}
