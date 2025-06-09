import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextApiRequest) {
  // TODO: Add pagination + filtering
  const supabase = await createClient();

  let { data: transactions, error } = await supabase.from('Transactions').select('*');

  if (error) throw error

  return new Response(JSON.stringify(transactions), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const { transactions } = body

  const { error } = await supabase
  .from('Transactions')
  .insert(transactions)
  .select()

  if (error) throw error

  return new Response(JSON.stringify(transactions), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
