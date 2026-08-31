import type { Metadata } from 'next';
import '@/globals.css';
import { Providers } from '@/providers';
import { Jost } from 'next/font/google';

import { RootHeader } from '@/lib/components/Root/RootHeader';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Ledger',
  description: 'Personal ledger of finances.',
};

const customFont = Jost({ variable: '--font-inter', subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${customFont.variable} antialiased`}>
      <body className="antialiased">
        <Providers>
          <RootHeader />
          <Suspense fallback={<p>Yikes! Something bad happened!</p>}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
