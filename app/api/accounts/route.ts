import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: accounts, error } = await supabase.from('Accounts').select('*');

  if (error) throw error

  return new Response(JSON.stringify(accounts), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
}