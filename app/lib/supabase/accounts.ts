import { createClient } from '@/lib/supabase/server';
import { Account } from '@/lib/supabase/types';

export default async function accounts() {
  const supabase = await createClient();

  async function getAccountById(accountId: number | string): Promise<Account | undefined> {
    const { data: account } = await supabase
      .from('Accounts')
      .select('*')
      .eq('id', Number(accountId))
      .single();
    if (!account) return;
    return account
  }

  return { getAccountById }
}