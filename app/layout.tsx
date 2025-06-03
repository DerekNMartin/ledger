import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

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
          <header className="p-6 mb-6 border-b border-neutral-300">
            <h1 className="font-bold text-2xl">Ledger</h1>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
