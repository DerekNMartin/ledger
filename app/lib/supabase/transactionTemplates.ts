import { createClient } from '@/lib/supabase/server';
import { TransactionInsert } from '@/lib/supabase/types';

export default async function transactionTemplates() {
  const supabase = await createClient();

  async function findMatchingTemplate(description: string) {
    const { data: matchingTemplate } = await supabase
      .from('Transaction_Templates')
      .select('*')
      .eq('description', description)
      .single();
    if (!matchingTemplate) return
    return matchingTemplate
  }

  async function templateMatchedTransactions(transactions: TransactionInsert[]) {
    const matchedTransactions = await Promise.all(transactions.map(async (transaction) => {
      const template = await findMatchingTemplate(transaction.description)
      const name = template?.name
      const category = template?.category
      const isReoccuring = template?.is_reoccuring ?? transaction.is_reoccuring
      return {
        ...transaction,
        is_reoccuring: isReoccuring,
        ...(name && { name }),
        ...(category && { category }),
      }
    }))

    return matchedTransactions
  }

  return { templateMatchedTransactions }
}