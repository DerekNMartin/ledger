import { Card, CardContent, CardHeader } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { InsightsMonthlyExpensesResponse } from '@/api/insights/monthly-expenses/route';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, type TooltipContentProps } from 'recharts';
import { useMemo } from 'react';

type MonthlyExpensesCardProps = {
  /** The account ID to filter by. */
  accountFilter?: string;
  dateRange: {
    start: string;
    end: string;
  };
};

function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(dateString.replace('-', '/'));
  const defaultOptions: Intl.DateTimeFormatOptions = { month: 'short' };
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
}

export function MonthlyExpensesCard({ dateRange, accountFilter }: MonthlyExpensesCardProps) {
  const { data: cashFlowResponse } = useQuery<InsightsMonthlyExpensesResponse>({
    queryKey: ['cashFlow', dateRange, accountFilter],
    queryFn: async () => {
      const baseUrl = window.location.origin;
      const url = new URL('/api/insights/monthly-expenses', baseUrl);
      url.searchParams.append('start_date', dateRange.start);
      url.searchParams.append('end_date', dateRange.end);
      if (accountFilter) url.searchParams.append('account_id', accountFilter);
      const response = await fetch(url.href);
      return response.json();
    },
  });

  const barChartExpensesData = useMemo(() => {
    return cashFlowResponse?.data
      .map((entry) => {
        return { date: entry.period_start_date, amount: entry.total_monthly_expenses };
      })
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        const dateA = new Date(a.date).getUTCMonth();
        const dateB = new Date(b.date).getUTCMonth();
        return dateA - dateB;
      });
  }, [cashFlowResponse]);

  return (
    <Card className="w-fit border border-violet-200 shadow-none rounded-2xl max-h-100">
      <CardHeader className="mb-4">
        <h3 className="font-medium">Monthly Expenses</h3>
      </CardHeader>
      <CardContent className="flex min-w-lg">
        <BarChart
          width={'100%'}
          height={'100%'}
          responsive
          data={barChartExpensesData}
          className="cn-chart flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-violet-100 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatDate(value)}
          />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="amount" radius={10} fill="var(--color-violet-600)" barSize={18} />
        </BarChart>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;
  const date =
    typeof label === 'string' ? formatDate(label, { month: 'long', year: 'numeric' }) : label;
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
            <span className="w-3 h-3 rounded-sm bg-violet-600 mr-2" />
            <p className="">{date}</p>
          </span>
          <p className="font-medium text-sm">{dollarAmount}</p>
        </>
      )}
    </div>
  );
};
