import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { InsightsCashFlowReturns } from '@/lib/supabase/types';

export type InsightsCashFlowResponse = {
  data: InsightsCashFlowReturns;
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParameters = request.nextUrl.searchParams;

  const accountIdFilter = searchParameters.get('account_id');
  const startDate = searchParameters.get('start_date');
  const endDate = searchParameters.get('end_date');

  const { data: monthlyFinacialComparisonData, error } = await supabase.rpc(
    'get_monthly_expenses',
    {
      account_filter: accountIdFilter ? Number(accountIdFilter) : undefined,
      start_date_filter: startDate || '',
      end_date_filter: endDate || '',
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: monthlyFinacialComparisonData,
  });
}
