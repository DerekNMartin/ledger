import type { Metadata } from 'next';
import '@/globals.css';
import { Providers } from '@/providers';
import { Jost } from 'next/font/google';

import { RootHeader } from '@/lib/components/Root/RootHeader';

export const metadata: Metadata = {
  title: 'Ledger',
  description: 'Personal ledger of finances.',
};

const interFont = Jost({ variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interFont.variable} antialiased`}>
      <body className="antialiased">
        <Providers>
          <RootHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
