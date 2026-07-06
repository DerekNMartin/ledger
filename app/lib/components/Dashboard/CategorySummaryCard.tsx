import { Card, CardContent, CardHeader } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { InsightsCategorySummaryResponse } from '@/api/insights/category-summary/route';
import { Pie, PieChart, PieSectorDataItem, Tooltip, type TooltipContentProps } from 'recharts';
import { useMemo } from 'react';
import { usePrivacyMode } from '@/lib/context/usePrivacyMode';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORY_FILTER_KEY } from '@/lib/constants/UrlParamKeys';

const COLOURS = [
  'var(--color-violet-600)',
  'var(--color-red-500)',
  'var(--color-orange-400)',
  'var(--color-yellow-400)',
  'var(--color-emerald-400)',
  'var(--color-teal-400)',
  'var(--color-blue-500)',
  'var(--color-purple-500)',
  'var(--color-fuchsia-500)',
  'var(--color-pink-500)',
  'var(--color-rose-500)',
];

type CategorySummaryCardProps = {
  /** The account ID to filter by. */
  accountFilter?: string;
  dateRange: {
    start: string;
    end: string;
  };
};

export function CategorySummaryCard({ dateRange, accountFilter }: CategorySummaryCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const privacyModeContext = usePrivacyMode();

  const { data: summaryResponse } = useQuery<InsightsCategorySummaryResponse>({
    queryKey: ['categorySummary', dateRange, accountFilter],
    queryFn: async () => {
      const baseUrl = window.location.origin;
      const url = new URL('/api/insights/category-summary', baseUrl);
      url.searchParams.append('start_date', dateRange.start);
      url.searchParams.append('end_date', dateRange.end);
      if (accountFilter) url.searchParams.append('account_id', accountFilter);
      const response = await fetch(url.href);
      return response.json();
    },
  });

  const summaryData = useMemo(() => {
    return summaryResponse?.data.map((entry, index) => {
      const fill = COLOURS[index] || 'var(--color-violet-600)';
      return { label: entry.category, value: entry.total_spent, fill };
    });
  }, [summaryResponse]);

  /** Navigates to the transactions list, filtered by the clicked category. */
  function handlePieClick(data: PieSectorDataItem) {
    if (!data.name) return;
    const params = new URLSearchParams(searchParams.toString());
    params.append(CATEGORY_FILTER_KEY, data.name);
    router.push(`/transactions?${params.toString()}`);
  }

  return (
    <Card className="border border-violet-200 shadow-none rounded-2xl w-full">
      <CardHeader className="mb-4">
        <h3 className="font-medium">Categories</h3>
      </CardHeader>
      <CardContent className="flex flex-row items-center min-w-lg">
        <PieChart
          style={{ height: '100%', width: '100%', aspectRatio: 1 }}
          responsive
          cx={'100%'}
          cy={'100%'}
          margin={{
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
        >
          <Pie data={summaryData} dataKey="value" nameKey="label" onClick={handlePieClick} />
          <Tooltip content={CustomTooltip} />
        </PieChart>
        <div className="flex flex-col gap-2">
          {summaryData?.map((entry) => {
            const dollarAmount = new Intl.NumberFormat('en-ca', {
              style: 'currency',
              currency: 'CAD',
            }).format(Number(entry.value || 0));
            return (
              <div key={entry.label} className="flex justify-between gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm mr-2" style={{ background: entry.fill }} />
                  <p className="capitalize text-neutral-500 text-sm">
                    {entry.label.replace('_', ' ')}
                  </p>
                </span>
                <p
                  className={`text-sm font-semibold ${
                    privacyModeContext.privacyModeEnabled ? 'hidden-digits' : null
                  }`}
                >
                  {dollarAmount}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload }: TooltipContentProps) => {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;
  const dollarAmount = new Intl.NumberFormat('en-ca', {
    style: 'currency',
    currency: 'CAD',
  }).format(Number(firstPayload?.value || 0));
  return (
    <div
      className="bg-white border border-violet-200 rounded-lg p-2 flex items-center gap-8"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      {isVisible && (
        <>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-sm mr-2" style={{ background: firstPayload.fill }} />
            <p className="capitalize">
              {typeof firstPayload.name === 'string' && firstPayload.name.replace('_', ' ')}
            </p>
          </span>
          <p className="font-medium text-sm">{dollarAmount}</p>
        </>
      )}
    </div>
  );
};
