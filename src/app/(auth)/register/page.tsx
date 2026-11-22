'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { registerAction } from '@/app/(auth)/actions';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  csrfToken: z.string().min(1, 'Security token is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [redirectTo, setRedirectTo] = useState('/dashboard');
  useEffect(() => {
    setRedirectTo(new URLSearchParams(window.location.search).get('redirectTo') ?? '/dashboard');
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', csrfToken: '' },
  });

  useEffect(() => {
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

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    const fd = new FormData();
    fd.append('email', data.email);
    fd.append('password', data.password);
    fd.append('redirectTo', redirectTo);
    fd.append('csrfToken', data.csrfToken);
    const result = await registerAction(fd);
    if (result?.error) {
      setError(result.error);
      setErrorCode(result.code ?? null);
      if (result.code === 'USER_ALREADY_EXISTS') {
        setSubmittedEmail(data.email);
      }
    } else if (result?.success && result?.message) {
      setSuccessMessage(result.message);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <VeyraLogo size="md" />
          <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
        </div>
        <h2 className="text-3xl font-bold text-veyra-navy mb-2">Create account</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Join VEYRA and start preparing for your next interview.
        </p>

        {error && errorCode === 'USER_ALREADY_EXISTS' && (
          <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900 shadow-sm">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-3 leading-snug">
                <p className="font-semibold text-amber-950">{error}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href={`/login?email=${encodeURIComponent(submittedEmail || form.getValues('email') || '')}&redirectTo=${encodeURIComponent(redirectTo)}`}
                    className="inline-flex items-center justify-center rounded-lg bg-veyra-indigo px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-veyra-indigo/90 transition-colors"
                  >
                    Sign in instead
                  </Link>
                  <Link
                    href={`/forgot-password?email=${encodeURIComponent(submittedEmail || form.getValues('email') || '')}`}
                    className="inline-flex items-center text-xs font-medium text-amber-900 underline hover:text-amber-950"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && errorCode !== 'USER_ALREADY_EXISTS' && (
          <div role="alert" className="mb-6 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        {successMessage && (
          <div role="status" className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="leading-snug">
              <p className="font-medium">{successMessage}</p>
              <Link
                href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                className="mt-2 inline-block font-semibold underline text-emerald-900"
              >
                Go to Sign in
              </Link>
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <PasswordInput
              id="confirmPassword"
              {...form.register('confirmPassword')}
              autoComplete="new-password"
              placeholder="Repeat your password"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-veyra-indigo hover:underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-veyra-indigo hover:underline">Privacy Policy</Link>.
          </p>

          <Button type="submit" className="w-full h-11" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-veyra-indigo font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <OAuthButtons redirectTo={redirectTo} />
      </div>
    </AuthLayout>
  );
}
