import type { Metadata } from 'next';
import '@/globals.css';
import { Providers } from '@/providers';

import { RootHeader } from '@/lib/components/Root/RootHeader';

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
          <RootHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
