'use client';

import type { Account } from '@/lib/supabase/types';
import { useQuery } from '@tanstack/react-query';

export function useAccounts() {
  const {
    data: accounts,
    error,
    isLoading,
  } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  return { accounts, error, isLoading };
}
