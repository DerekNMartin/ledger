'use client';
import { useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from '@/auth/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  // This ensures the queryClient is only created once per session
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
