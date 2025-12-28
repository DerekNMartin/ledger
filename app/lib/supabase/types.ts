import type { TablesInsert, Tables } from '@/lib/supabase/database.types';

// Transaction Template Types
export type TransactionTemplate = Tables<'Transaction_Templates'>
export type TransactionTemplateInsert = TablesInsert<'Transaction_Templates'>

// Transaction Types
export type Transaction = Tables<'Transactions'>
export type TransactionInsert = TablesInsert<'Transactions'>

// Account Types
export type Account = Tables<'Accounts'>