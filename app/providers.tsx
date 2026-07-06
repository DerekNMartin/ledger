'use client';
import { useState } from 'react';
import { AuthProvider } from '@/auth/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivacyModeProvider } from '@/lib/context/usePrivacyMode';

export function Providers({ children }: { children: React.ReactNode }) {
  // This ensures the queryClient is only created once per session
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PrivacyModeProvider>{children}</PrivacyModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
