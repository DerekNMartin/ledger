'use client';

import SignoutButton from '@/auth/SignoutButton';
import Link from 'next/link';
import { Tabs } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const menuOptions = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
  },
];

export function RootHeader() {
  const pathname = usePathname();

  const currentKey = useMemo(() => {
    const [dashboardTab, transactionsTab] = menuOptions;
    return pathname.includes('transactions') ? transactionsTab.id : dashboardTab.id;
  }, [pathname]);

  return (
    <header className="flex p-6 mb-6 justify-between items-center">
      <Link href={'/'}>
        <h1 className="font-bold text-2xl my-1">Ledger</h1>
      </Link>
      <Tabs selectedKey={currentKey}>
        <Tabs.ListContainer>
          <Tabs.List aria-label="Root Menu Tab Options" className="bg-violet-100">
            {menuOptions.map((option) => {
              return (
                <Tabs.Tab key={option.id} id={option.id}>
                  <Link
                    className="w-full h-full flex items-center justify-center"
                    href={option.path}
                  >
                    {option.label}
                    <Tabs.Indicator />
                  </Link>
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
      <SignoutButton />
    </header>
  );
}
