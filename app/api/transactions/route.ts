import { Transaction, TransactionTemplateInsert } from '@/lib/supabase/types';
import { createClient } from '@/lib/supabase/server';

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
