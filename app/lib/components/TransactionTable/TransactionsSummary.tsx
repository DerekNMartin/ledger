import { TransactionSummary } from '@/lib/services/transactions';
import { Card } from '@heroui/react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  CreditCardIcon,
  TagIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { useMemo } from 'react';

export type TransactionsSummaryProps = {
  summary?: TransactionSummary;
};

export function TransactionsSummary({ summary }: TransactionsSummaryProps) {
  // Summary Card Data
  const summaryData = useMemo(() => {
    if (!summary) return null;
    return {
      totalSpent: {
        label: 'Total Spent',
        icon: ArrowUpTrayIcon,
        value: summary.totalSpent || 0,
      },
      totalIncome: {
        label: 'Total Income',
        icon: ArrowDownTrayIcon,
        value: summary.totalIncome || 0,
      },
      netCashFlow: {
        label: 'Net Cash Flow',
        icon: WalletIcon,
        value: summary.netCashFlow || 0,
      },
      fixedCosts: {
        label: 'Recurring Costs',
        icon: ArrowPathIcon,
        value: summary.fixedCosts || 0,
      },
      variableCosts: {
        label: 'Variable Costs',
        icon: CreditCardIcon,
        value: summary.variableCosts || 0,
      },
      topCategory: {
        label: 'Top Spending Category',
        icon: TagIcon,
        value: summary.topCategory || 'N/A',
      },
    };
  }, [summary]);

  return (
    <section className="flex flex-none gap-4 p-6 border-b border-neutral-200 flex-wrap">
      {summaryData &&
        Object.values(summaryData).map((data) => (
          <Card key={data.label} className="flex-1 p-4 border " radius="sm" shadow="none">
            <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <data.icon className="w-4 h-4 shrink-0" />
              <span className="font-medium">{data.label}</span>
            </div>
            <div className="text-2xl font-semibold capitalize">
              {typeof data.value === 'number'
                ? data.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })
                : data.value}
            </div>
          </Card>
        ))}
    </section>
  );
}
