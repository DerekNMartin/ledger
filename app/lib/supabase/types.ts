import type { Database } from '@/lib/supabase/database.types';

export type TransactionTemplate = Database['public']['Tables']['Transaction_Templates']['Row']
export type TransactionTemplateInsert = Database['public']['Tables']['Transaction_Templates']['Insert']

export type Transaction = Database['public']['Tables']['Transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['Transactions']['Insert']