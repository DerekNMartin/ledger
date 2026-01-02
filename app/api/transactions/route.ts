import { Transaction } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  generateCsvResponse,
  processTransactions,
  processTemplates,
  TransactionSummary,
  calculateSummary,
  applyTransactionFilters,
} from '@/lib/services/transactions';

export type APIResponseMeta = {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type TransactionsResponse = {
  data: Transaction[];
  meta: APIResponseMeta;
  summary: TransactionSummary;
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParameters = request.nextUrl.searchParams;

  /**
   * Lightweight fetch (only columns needed for calculations)
   * This saves bandwidth by not fetching heavy columns like 'id' or 'created_at' for every row.
   */
  let summaryQuery = supabase.from('Transactions').select('amount, category, is_reoccuring');

  summaryQuery = applyTransactionFilters(summaryQuery, searchParameters);

  const { data: summaryData, error: summaryError } = await summaryQuery;

  if (summaryError) {
    return NextResponse.json({ error: summaryError.message }, { status: 500 });
  }

  const financialSummary = calculateSummary(summaryData || []);

  // Handle CSV Download (Full dataset, no pagination)
  if (searchParameters.get('download') === 'true') {
    let downloadQuery = supabase.from('Transactions').select('*');
    downloadQuery = applyTransactionFilters(downloadQuery, searchParameters);

    const { data: fullData, error: downloadError } = await downloadQuery;
    if (downloadError) return NextResponse.json({ error: downloadError.message }, { status: 500 });

    return generateCsvResponse(fullData || []);
  }

  // 3. Data Query: Optimized fetch using .range() for database-level pagination
  const pageNumber = parseInt(searchParameters.get('page') || '1');
  const pageSize = parseInt(searchParameters.get('page_size') || '25');
  const rangeStart = (pageNumber - 1) * pageSize;
  const rangeEnd = rangeStart + pageSize - 1;

  let dataQuery = supabase
    .from('Transactions')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(rangeStart, rangeEnd);

  dataQuery = applyTransactionFilters(dataQuery, searchParameters);

  const { data: paginatedTransactions, error: dataError, count: totalCount } = await dataQuery;

  if (dataError) {
    return NextResponse.json({ error: dataError.message }, { status: 500 });
  }

  return NextResponse.json({
    data: paginatedTransactions || [],
    meta: {
      total_count: totalCount || 0,
      page: pageNumber,
      page_size: pageSize,
      total_pages: totalCount ? Math.ceil(totalCount / pageSize) : 0,
    },
    summary: financialSummary,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const transactions = body.transactions as Transaction[];
  // remove temporary ID added in /transactions/upload
  const cleanedTransactions = processTransactions(transactions);
  const { error } = await supabase.from('Transactions').insert(cleanedTransactions).select();
  if (error) {
    console.error('Error inserting transactions:', error);
    throw error;
  }

  const templates = processTemplates(transactions);
  const { error: templatesError } = await supabase
    .from('Transaction_Templates')
    .upsert(templates, { onConflict: 'description' })
    .select();
  if (templatesError) {
    console.error('Error inserting templates:', templatesError);
    throw error;
  }

  return new Response(JSON.stringify(transactions), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
