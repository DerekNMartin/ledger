import type { Metadata } from 'next';
import '@/globals.css';
import { Providers } from '@/providers';

import SignoutButton from './components/SignoutButton';

export const metadata: Metadata = {
  title: 'Ledger',
  description: 'Personal ledger of finances.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <header className="flex p-6 mb-6 border-b border-neutral-300 justify-between">
            <h1 className="font-bold text-2xl">Ledger</h1>
            <SignoutButton />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
