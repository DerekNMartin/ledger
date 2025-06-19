'use client';

import { Button } from '@heroui/react';
import { useSupabaseContext } from '@/auth/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignoutButton() {
  const { supabaseClient, isAuth } = useSupabaseContext();
  const router = useRouter();

  async function handleSignOut() {
    await supabaseClient.auth.signOut();
    router.push('/transactions');
  }

  return isAuth ? (
    <Button variant="bordered" onPress={handleSignOut}>
      Sign Out
    </Button>
  ) : null;
}
