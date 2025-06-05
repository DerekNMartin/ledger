'use client';

import { supabaseContext } from '@/context/AuthContext';
import { Button, Input } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { supabaseClient } = supabaseContext();

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
        <CardHeader className="flex flex-col gap-2 items-start">
          <h3 className="text-xl">Login</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading} color="primary">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
