'use client';

import { useEffect, useState } from 'react';
import type { Account } from '@/api/accounts/route';

let cachedAccounts: Account[] | null = null;
let fetching: Promise<Account[]> | null = null;

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[] | null>(cachedAccounts);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cachedAccounts) return;

    const fetchAccounts = async () => {
      try {
        if (!fetching) {
          setIsLoading(true);
          fetching = fetch('/api/accounts')
            .then((res) => res.json())
            .then((data: Account[]) => {
              cachedAccounts = data;
              return data;
            });
        }
        const data = await fetching;
        setAccounts(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, error, isLoading };
}
