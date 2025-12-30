import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useUrlState(key: string, defaultValue: string = '') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Get the current value from the URL
  const value = searchParams.get(key) ?? defaultValue;

  // 2. Reactive setter
  const setUrlState = useCallback(
    (newValue: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newValue === null || newValue === defaultValue || newValue === '') {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }

      // We always reset to page 1 when filters change
      if (key !== 'page') params.delete('page');

      // 'scroll: false' prevents the page from jumping to the top on every keystroke
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [key, defaultValue, searchParams, pathname, router]
  );

  return [value, setUrlState] as const;
}
