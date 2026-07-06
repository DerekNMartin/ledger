'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TransactionsResponse } from '@/api/transactions/route';

import { YearSelect } from '@/lib/components/YearSelect';
import AccountSelect from '@/lib/components/AccountSelect';
import { useUrlState } from '@/lib/hooks/useUrlState';
import { TransactionsSummary } from '@/lib/components/TransactionTable/TransactionsSummary';
import { MonthlyExpensesCard } from '@/lib/components/Dashboard/MonthlyExpensesCard';
import { CategorySummaryCard } from '@/lib/components/Dashboard/CategorySummaryCard';
import { PrivacyButton } from '@/lib/components/PrivacyButton';

export default function Home() {
  const [filterYear, setFilterYear] = useUrlState('year', '2025');
  const [selectedAccount, setSelectedAccount] = useState<string>();

  const filterDateRange = {
    start: `${filterYear}-01-01`,
    end: `${filterYear}-12-31`,
  };

  const { data: transactionResponse } = useQuery<TransactionsResponse>({
    queryKey: ['transactions', filterYear, selectedAccount],
    queryFn: async () => {
      const baseUrl = window.location.origin;
      const url = new URL('/api/transactions', baseUrl);
      url.searchParams.append('start_date', filterDateRange.start);
      url.searchParams.append('end_date', filterDateRange.end);
      const response = await fetch(url.href);
      return response.json();
    },
  });

  return (
    <main className="flex flex-col h-full max-w-7xl mx-auto p-6 xl:p-0 gap-8">
      <section className="flex justify-between items-end">
        <h2 className="font-semibold text-2xl">Hello Derek!</h2>
        <div className="flex gap-2">
          <PrivacyButton />
          <YearSelect
            selectedYear={filterYear}
            onYearChange={(year) => (year ? setFilterYear(year) : null)}
          />
          <AccountSelect
            value={selectedAccount}
            onChange={(selection) =>
              typeof selection === 'string' ? setSelectedAccount(selection) : null
            }
          />
        </div>
      </section>
      {transactionResponse?.summary && (
        <TransactionsSummary summary={transactionResponse.summary} />
      )}
      <div className="flex gap-4">
        <MonthlyExpensesCard dateRange={filterDateRange} accountFilter={selectedAccount} />
        <CategorySummaryCard dateRange={filterDateRange} accountFilter={selectedAccount} />
      </div>
    </main>
  );
}
