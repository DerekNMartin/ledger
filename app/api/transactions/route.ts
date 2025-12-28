import { Transaction, TransactionTemplateInsert } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export type APIResponseMeta = {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type TransactionsResponse = {
  data: Transaction[];
  meta: APIResponseMeta;
};

function processTransactions(transactions: Transaction[]) {
  return transactions.map((transaction) => {
    const { id: _id, ...rest } = transaction
    return rest
  })
}

function processTemplates(transactions: Transaction[]): TransactionTemplateInsert[] {
  const seen = new Set<string>();
  const dedupedTemplates: Transaction[] = [];

  for (const transaction of transactions) {
    const key = transaction.description;
    if (!seen.has(key)) {
      seen.add(key);
      dedupedTemplates.push(transaction);
    }
  }

  return dedupedTemplates.map((transaction) => ({
    category: transaction.category,
    is_reoccuring: transaction.is_reoccuring,
    name: transaction.name,
    description: transaction.description
  }))
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // Date Range Filter
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  // Pagination Filter
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('page_size') || '20');
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('Transactions')
    .select('*', { count: 'exact' }) // count: 'exact' gives us the total row count for the UI
    .order('date', { ascending: false })
    .range(from, to);

  // Apply Filters conditionally
  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data: transactions, error, count } = await query;

  if (error) throw error

  return new Response(
    JSON.stringify({
      data: transactions,
      meta: {
        total_count: count,
        page,
        page_size: pageSize,
        total_pages: count ? Math.ceil(count / pageSize) : 0,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const transactions = body.transactions as Transaction[]
  // remove temporary ID added in /transactions/upload
  const cleanedTransactions = processTransactions(transactions);
  const { error } = await supabase
    .from('Transactions')
    .insert(cleanedTransactions)
    .select()
  if (error) {
    console.error('Error inserting transactions:', error);
    throw error
  }

  const templates = processTemplates(transactions)
  const { error: templatesError } = await supabase
    .from('Transaction_Templates')
    .upsert(templates, { onConflict: 'description' })
    .select()
  if (templatesError) {
    console.error('Error inserting templates:', templatesError);
    throw error
  }

  return new Response(JSON.stringify(transactions), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
