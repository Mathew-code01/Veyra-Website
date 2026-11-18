'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { loginAction } from '@/app/(auth)/actions';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const [redirectTo, setRedirectTo] = useState('/dashboard');
  useEffect(() => { setRedirectTo(new URLSearchParams(window.location.search).get('redirectTo') ?? '/dashboard'); }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setError(null);
    const fd = new FormData();
    fd.append('email', data.email);
    fd.append('password', data.password);
    fd.append('redirectTo', redirectTo);
    const result = await loginAction(fd);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <VeyraLogo size="md" />
          <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
        </div>
        <h2 className="text-3xl font-bold text-veyra-navy mb-2">Welcome back</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Sign in to your VEYRA account.
        </p>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                {...form.register('email')}
                type="email"
                className="input pl-9"
                placeholder="you@example.com"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                {...form.register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input pr-10 pl-9"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border" /> Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-veyra-indigo hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-veyra-indigo font-medium hover:underline">
            Create an account
          </Link>
        </p>

        <OAuthButtons redirectTo={redirectTo} />
      </div>
    </AuthLayout>
  );
}
