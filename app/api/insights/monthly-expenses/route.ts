import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { InsightsMonthlyExpensesReturns } from '@/lib/supabase/types';

export type InsightsMonthlyExpensesResponse = {
  data: InsightsMonthlyExpensesReturns;
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParameters = request.nextUrl.searchParams;

  const accountIdFilter = searchParameters.get('account_id');
  const startDate = searchParameters.get('start_date');
  const endDate = searchParameters.get('end_date');
  const categoryFilter = searchParameters.get('category');

  const { data: monthlyExpensesData, error } = await supabase.rpc('get_monthly_expenses', {
    start_date_filter: startDate || '',
    end_date_filter: endDate || '',
    account_filter: accountIdFilter ? Number(accountIdFilter) : undefined,
    category_filter: categoryFilter ? categoryFilter : undefined,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: monthlyExpensesData,
  });
}
