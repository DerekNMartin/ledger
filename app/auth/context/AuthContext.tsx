'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import type { User, AuthError } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  error: AuthError | null;
  isAuth: boolean;
  supabaseClient: typeof supabaseClient;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Initial user fetch
    supabaseClient.auth.getUser().then(({ data, error }) => {
      setUser(data.user);
      setError(error ?? null);
    });

    // Listen for future auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    error,
    isAuth: Boolean(user) && !error,
    supabaseClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('SupabaseContext must be used within an AuthProvider');
  }
  return context;
}
