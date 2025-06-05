'use client';

import { Button } from '@heroui/react';
import { supabaseContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignoutButton() {
  const { supabaseClient, isAuth } = supabaseContext();
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
