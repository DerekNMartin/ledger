import { Transaction, TransactionTemplateInsert } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  // TODO: Add pagination + filtering
  const supabase = await createClient();

  const { data: transactions, error } = await supabase.from('Transactions').select('*');

  if (error) throw error

  return new Response(JSON.stringify(transactions), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const transactions = body.transactions as Transaction[]
  // remove temporary ID added in /transactions/upload
  const cleanedTransactions = transactions.map((transaction) => {
    const { id: _id, ...rest } = transaction
    return rest
  })
  const { error } = await supabase
    .from('Transactions')
    .insert(cleanedTransactions)
    .select()

  const templates: TransactionTemplateInsert[] = transactions.map((transaction) => ({
    category: transaction.category,
    is_reoccuring: transaction.is_reoccuring,
    name: transaction.name,
    description: transaction.description
  }))
  await supabase
    .from('Transaction_Templates')
    .upsert(templates)
    .select()

  if (error) throw error

  return new Response(JSON.stringify(transactions), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
