/**
 * WealthSimple - date | transaction | description | amount | balance
 * AMEX - date | date processed | description | amount
 * RBC - account type | account number | transaction date | cheque number | description 1 | description 2 | CAD$ | USD$
 * Scotiabank - filter | date | description | sub-description | status | type of transaction | amount
 * date | description | amount
 */

import type { TransactionInsert } from '@/lib/supabase/types';

import { fileToJson } from '@/lib/xlsx/utils';
import transactionTemplates from '@/lib/supabase/transactionTemplates'


function processDate(dateString?: string) {
  if (!dateString) return 'No Date'
  const date = new Date(dateString);
  const isValidDate = !isNaN(date.valueOf());
  return isValidDate ? date.toISOString() : 'Invalid Date'
}

function normalizeDescription(description: any) {
  if (!description) return 'No Description'

  const VENDOR_ALIASES = {
    amazon: 'amazon',
    dazn: 'dazn',
    youtube: 'youtube',
    mcdonalds: 'mcdonalds',
    'uber trip': 'uber trip',
    doordash: 'doordash',
    lyft: 'lyft',
    msbill: 'microsoft',
    'joes nf': 'no frills',
    loblaw: 'loblaws',
  };

  const cleaned = description
    .toLowerCase()
    .replace(/https?:\/\//gi, '')
    .replace(/www\./gi, '') // remove www. (case insensitive)
    .replace(/\.(ca|com|co|c|ub)/gi, '') // remove website TLDs (case insensitive)
    .replace(/\d+/g, '') // remove numbers
    .replace(/[^\w\s]/g, '') // remove special chars
    .replace(/\s+/g, ' ') // remove whitespace
    .trim()

  const matchingAliasKey = Object.keys(VENDOR_ALIASES).find((key) => cleaned.includes(key)) as keyof typeof VENDOR_ALIASES
  const matchingAlias = VENDOR_ALIASES[matchingAliasKey]

  return matchingAlias || cleaned;
}

function findKey(keyType: 'date' | 'amount' | 'description', rowItem: Record<string, any>) {
  const colHeaderVariants = {
    date: ['date', 'transaction date'],
    amount: ['amount', 'cad$'],
    description: ['description', 'description 1']
  }
  return Object.keys(rowItem).find((key) =>
    colHeaderVariants[keyType].includes(key.toLowerCase())
  ) as keyof typeof rowItem;
}

function createTransactions(json: Record<string, any>[], accountId?: string): TransactionInsert[] {
  const newTransactions = json.reduce<TransactionInsert[]>((transactions, tableRow) => {
    const dateKey = findKey('date', tableRow);
    const amountKey = findKey('amount', tableRow);
    const descriptionKey = findKey('description', tableRow)

    const description = normalizeDescription(tableRow[descriptionKey])

    const newTransaction = {
      id: crypto.randomUUID(),
      description,
      name: null,
      category: 'general',
      is_reoccuring: false,
      account_id: Number(accountId) || null,
      amount: Number(tableRow[amountKey]),
      date: processDate(tableRow[dateKey]),
    };

    transactions.push(newTransaction);
    return transactions;
  }, []);
  return newTransactions;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const account = formData.get('account') as string;

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const json = await fileToJson<Record<string, any>>(file);
  const newTransactions = createTransactions(json, account);

  const { templateMatchedTransactions } = await transactionTemplates()
  const matchedTransactions = await templateMatchedTransactions(newTransactions)

  return Response.json({ data: matchedTransactions });
}
