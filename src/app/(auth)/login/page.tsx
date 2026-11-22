'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { loginAction } from '@/app/(auth)/actions';
import { Mail, AlertCircle } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  csrfToken: z.string().min(1, 'Security token is required'),
});

export default function LoginPage() {
  const [redirectTo, setRedirectTo] = useState('/dashboard');
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '', csrfToken: '' },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectTo(params.get('redirectTo') ?? '/dashboard');
    const emailParam = params.get('email');
    if (emailParam) {
      form.setValue('email', emailParam);
    }
    // Fetch CSRF token
    fetch('/api/csrf-token')
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setCsrfToken(data.token);
          form.setValue('csrfToken', data.token);
        }
      })
      .catch(() => {
        // CSRF token fetch failed silently
      });
  }, [form]);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setError(null);
    const fd = new FormData();
    fd.append('email', data.email);
    fd.append('password', data.password);
    fd.append('redirectTo', redirectTo);
    fd.append('csrfToken', data.csrfToken);
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
          <div role="alert" className="mb-6 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-snug">
              {error}
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href={`/forgot-password?email=${encodeURIComponent(form.getValues('email') || '')}`}
                  className="font-medium text-rose-900 underline hover:text-rose-950"
                >
                  Forgot your password?
                </Link>
                <span className="text-rose-400">•</span>
                <Link
                  href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`}
                  className="font-semibold text-veyra-indigo underline hover:text-veyra-navy"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="email"
                {...form.register('email')}
                type="email"
                autoComplete="email"
                className="input pl-10"
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
            <PasswordInput
              id="password"
              {...form.register('password')}
              autoComplete="current-password"
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-border" /> Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-veyra-indigo hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full h-11" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-veyra-indigo font-semibold hover:underline">
            Create an account
          </Link>
        </p>

        <OAuthButtons redirectTo={redirectTo} />
      </div>
    </AuthLayout>
  );
}
