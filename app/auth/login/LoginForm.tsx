'use client';

import { useSupabaseContext } from '@/auth/context/AuthContext';
import { Button, Input, Card, TextField, Label } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { supabaseClient } = useSupabaseContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/transactions');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={'flex flex-col gap-6' + className} {...props}>
      <Card className="min-w-lg p-4">
        <Card.Header className="flex flex-col gap-2 items-start">
          <h3 className="text-xl">Login</h3>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <TextField type="email" isRequired>
                  <Label>Email</Label>
                  <Input
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TextField>
              </div>
              <div className="grid gap-2">
                <TextField type="password" isRequired>
                  <Label>Password</Label>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                </TextField>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" isDisabled={isLoading} variant="primary">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
