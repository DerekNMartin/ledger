import type { TablesInsert, Tables, Database } from '@/lib/supabase/database.types';

// Transaction Template Types
export type TransactionTemplate = Tables<'Transaction_Templates'>;
export type TransactionTemplateInsert = TablesInsert<'Transaction_Templates'>;

// Transaction Types
export type Transaction = Tables<'Transactions'>;
export type TransactionInsert = TablesInsert<'Transactions'>;

// Account Types
export type Account = Tables<'Accounts'>;

// Insight Types
export type InsightsMonthlyExpensesArgs =
  Database['public']['Functions']['get_monthly_expenses']['Args'];
export type InsightsMonthlyExpensesReturns =
  Database['public']['Functions']['get_monthly_expenses']['Returns'];

export type InsightsCategoriesArgs =
  Database['public']['Functions']['get_category_summary']['Args'];
export type InsightsCategoriesReturns =
  Database['public']['Functions']['get_category_summary']['Returns'];
