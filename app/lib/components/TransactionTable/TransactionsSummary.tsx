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
        label: 'Expenses',
        icon: ArrowUpTrayIcon,
        value: summary.totalSpent || 0,
      },
      totalIncome: {
        label: 'Income',
        icon: ArrowDownTrayIcon,
        value: summary.totalIncome || 0,
      },
      netCashFlow: {
        label: 'Profit',
        icon: WalletIcon,
        value: summary.netCashFlow || 0,
      },
      fixedCosts: {
        label: 'Recurring',
        icon: ArrowPathIcon,
        value: summary.fixedCosts || 0,
      },
      variableCosts: {
        label: 'Variable',
        icon: CreditCardIcon,
        value: summary.variableCosts || 0,
      },
      topCategory: {
        label: 'Top Category',
        icon: TagIcon,
        value: summary.topCategory || 'N/A',
      },
    };
  }, [summary]);

  return (
    <section className="grid grid-cols-3 grid-rows-2 gap-4 py-8 pt-0 border-b border-neutral-200 flex-wrap">
      {summaryData &&
        Object.values(summaryData).map((data) => (
          <Card
            key={data.label}
            className="flex-1 p-3 border-neutral-200 border gap-3 shrink-0 rounded-lg"
          >
            <div className="flex gap-2 items-center">
              <span className="bg-violet-50 rounded-xl p-3 w-fit">
                <data.icon className="w-4 h-4 shrink-0 text-violet-600" strokeWidth={2} />
              </span>
              <div className="text-neutral-500 text-sm font-medium">{data.label}</div>
            </div>

            <div className="text-xl font-semibold capitalize">
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
