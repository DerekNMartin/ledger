import { Transaction, TransactionInsert, TransactionTemplateInsert } from '@/lib/supabase/types';
import * as XLSX from 'xlsx';
import { Database } from '@/lib/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * A utility type that extracts the exact filter builder type for the Transactions table.
 * This avoids the need to import non-exported internal types from Supabase.
 */
type TransactionsFilterBuilder = ReturnType<ReturnType<SupabaseClient<Database>['from']>['select']>;

// A lightweight version of the transaction for summary calculations
export type TransactionSummaryInput = Pick<Transaction, 'amount' | 'category' | 'is_reoccuring'>;

/**
 * Represents a financial summary of a filtered set of transactions.
 */
export type TransactionSummary = {
  /** The sum of all negative transaction amounts. */
  totalSpent: number;
  /** The sum of all positive transaction amounts. */
  totalIncome: number;
  /** The total net change in funds (income plus spending). */
  netCashFlow: number;
  /** The sum of all recurring transaction amounts. */
  fixedCosts: number;
  /** The sum of all non-recurring transaction amounts. */
  variableCosts: number;
  /** The name of the category with the highest total spending. */
  topCategory: string;
};

/**
 * Transforms transactions for insertion by removing temporary client-side IDs.
 */
export function processTransactions(transactions: Transaction[]): TransactionInsert[] {
  return transactions.map((transaction) => {
    const { id: _id, ...rest } = transaction;
    return rest;
  });
}

/**
 * Extracts unique templates from a list of transactions.
 */
export function processTemplates(transactions: Transaction[]): TransactionTemplateInsert[] {
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
    description: transaction.description,
  }));
}

/**
 * Converts transaction data into a downloadable CSV Response.
 */
export function generateCsvResponse(data: Transaction[]): Response {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="transactions.csv"',
    },
  });
}

/**
 * Calculates financial summaries using a lightweight list of transaction data.
 */
export function calculateSummary(transactions: TransactionSummaryInput[]): TransactionSummary {
  const summaryResults = transactions.reduce(
    (accumulator, transaction) => {
      // Skip transactions categorized as 'excluded' for all financial totals
      if (transaction.category === 'excluded') {
        return accumulator;
      }

      const transactionAmount = transaction.amount || 0;

      // Update Net Cash Flow
      accumulator.netCashFlow += transactionAmount;

      // Update Income vs Spending
      if (transactionAmount < 0) {
        accumulator.totalSpent += transactionAmount;
      } else {
        accumulator.totalIncome += transactionAmount;
      }

      // Update Fixed vs Variable Costs (Discretionary)
      if (transaction.is_reoccuring) {
        accumulator.fixedCosts += transactionAmount;
      } else {
        accumulator.variableCosts += transactionAmount;
      }

      return accumulator;
    },
    {
      totalSpent: 0,
      totalIncome: 0,
      netCashFlow: 0,
      fixedCosts: 0,
      variableCosts: 0,
    }
  );

  // Calculate Top Spending Category separately
  const categorySpendingMap = transactions.reduce(
    (categoryTotals: Record<string, number>, transaction) => {
      const categoryName = transaction.category;
      const amountValue = transaction.amount || 0;

      if (categoryName && categoryName !== 'excluded' && amountValue < 0) {
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Math.abs(amountValue);
      }
      return categoryTotals;
    },
    {}
  );

  const categoryEntries = Object.entries(categorySpendingMap);
  const sortedCategories = categoryEntries.sort(
    ([, totalValueA], [, totalValueB]) => totalValueB - totalValueA
  );
  const topCategoryEntry = sortedCategories[0];

  return {
    ...summaryResults,
    topCategory: topCategoryEntry ? topCategoryEntry[0] : 'N/A',
  };
}

/**
 * Applies standard transaction filters (search and date range) to a Supabase query builder.
 * This ensures filters are consistent across summary, data, and export queries.
 */
export function applyTransactionFilters(
  query: TransactionsFilterBuilder,
  searchParameters: URLSearchParams
): TransactionsFilterBuilder {
  // Search Filter
  const searchString = searchParameters.get('search');
  if (searchString) {
    query = query.or(`name.ilike.%${searchString}%,description.ilike.%${searchString}%`);
  }

  // Date Range Filter
  const startDateString = searchParameters.get('start_date');
  const endDateString = searchParameters.get('end_date');
  if (startDateString) {
    query = query.gte('date', startDateString);
  }
  if (endDateString) {
    query = query.lte('date', endDateString);
  }

  // Apply Category Filter (supports single or comma-separated multiple values)
  const categoryFilterString = searchParameters.get('category');
  if (categoryFilterString) {
    // Split comma-separated string into an array (e.g., "groceries,bills" -> ["groceries", "bills"])
    const categoriesToFilter = categoryFilterString.split(',');
    if (categoriesToFilter.length > 0) {
      query = query.in('category', categoriesToFilter);
    }
  }

  return query;
}
