/**
 * WealthSimple - date | transaction | description | amount | balance
 * AMEX - date | date processed | description | amount
 * RBC - account type | account number | transaction date | cheque number | description 1 | description 2 | CAD$ | USD$
 * Scotiabank - filter | date | description | sub-description | status | type of transaction | amount
 * date | description | amount
 */

import * as XLSX from 'xlsx';

export interface Transaction {
  id: string;
  account: string | null;
  date: number;
  name: string | null;
  description: string;
  amount: number;
  category: string | null;
  isReoccuring: boolean;
}

function normalizeData(sheet: XLSX.WorkSheet, accountName?: string) {
  const dateColNames = ['date', 'transaction date'];
  const amountColNames = ['amount', 'cad$'];
  const descriptionColNames = ['description', 'description 1'];

  const json = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet);

  const data = json.reduce<Transaction[]>((items, current) => {
    const dateKey = Object.keys(current).find((key) =>
      dateColNames.includes(key.toLowerCase())
    ) as keyof typeof current;
    const amountKey = Object.keys(current).find((key) =>
      amountColNames.includes(key.toLowerCase())
    ) as keyof typeof current;
    const descriptionKey = Object.keys(current).find((key) =>
      descriptionColNames.includes(key.toLowerCase())
    ) as keyof typeof current;

    const obj = {
      id: crypto.randomUUID(),
      account: accountName || null,
      date: Number(current[dateKey]),
      name: null,
      description: typeof current[descriptionKey] === 'string' ? current[descriptionKey] : '',
      amount: Number(current[amountKey]),
      category: 'general',
      isReoccuring: false,
    };

    items.push(obj);
    return items;
  }, []);
  return data;
}

async function fileToSheet(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = await XLSX.read(buffer, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  return sheet;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const account = formData.get('account') as string;

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const sheet = await fileToSheet(file);
  const json = normalizeData(sheet, account);

  return Response.json({ data: json });
}
