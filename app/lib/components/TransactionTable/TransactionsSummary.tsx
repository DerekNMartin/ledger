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
import { usePrivacyMode } from '@/lib/context/usePrivacyMode';

export type TransactionsSummaryProps = {
  summary?: TransactionSummary;
};

export function TransactionsSummary({ summary }: TransactionsSummaryProps) {
  const privacyModeContext = usePrivacyMode();

  // Summary Card Data
  const summaryData = useMemo(() => {
    return {
      totalSpent: {
        label: 'Expenses',
        icon: ArrowUpTrayIcon,
        value: summary?.totalSpent || 0,
      },
      totalIncome: {
        label: 'Income',
        icon: ArrowDownTrayIcon,
        value: summary?.totalIncome || 0,
      },
      netCashFlow: {
        label: 'Profit',
        icon: WalletIcon,
        value: summary?.netCashFlow || 0,
      },
      fixedCosts: {
        label: 'Recurring',
        icon: ArrowPathIcon,
        value: summary?.fixedCosts || 0,
      },
      variableCosts: {
        label: 'Variable',
        icon: CreditCardIcon,
        value: summary?.variableCosts || 0,
      },
      topCategory: {
        label: 'Top Category',
        icon: TagIcon,
        value: summary?.topCategory || 'N/A',
      },
    };
  }, [summary]);

  function transactionValue(value: string | number) {
    if (privacyModeContext.privacyModeEnabled) return '0123456789';
    return typeof value === 'number'
      ? value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      : value;
  }

  return (
    <section className="grid grid-cols-3 grid-rows-2 gap-4 flex-wrap">
      {summaryData &&
        Object.values(summaryData).map((data) => (
          <Card
            key={data.label}
            className="flex-1 p-3 border-violet-200 border gap-5 shrink-0 shadow-none rounded-2xl"
          >
            <div className="flex gap-2 items-center">
              {/* Icon */}
              <span className="bg-violet-100 rounded-lg p-2 w-fit">
                <data.icon className="w-4 h-4 shrink-0 text-violet-600" strokeWidth={2} />
              </span>
              {/* Label */}
              <div className="text-sm font-medium">{data.label}</div>
            </div>

            {/* Value */}
            <div
              className={`text-xl font-semibold capitalize ${
                privacyModeContext.privacyModeEnabled ? 'hidden-digits' : null
              }`}
            >
              {data.value ? transactionValue(data.value) : '-'}
            </div>
          </Card>
        ))}
    </section>
  );
}
