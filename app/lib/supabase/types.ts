import type { Database } from '@/lib/supabase/database.types';

// Transaction Template Types
export type TransactionTemplate = Database['public']['Tables']['Transaction_Templates']['Row']
export type TransactionTemplateInsert = Database['public']['Tables']['Transaction_Templates']['Insert']

// Transaction Types
export type Transaction = Database['public']['Tables']['Transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['Transactions']['Insert']

// Account Types
export type Account = Database['public']['Tables']['Accounts']['Row']