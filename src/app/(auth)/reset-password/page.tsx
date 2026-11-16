'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VeyraLogo } from '@/components/marketing/logo';
import { getSupabase } from '@/lib/env';

const ResetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    let active = true;
    try {
      void getSupabase().auth.getSession().then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError || !data.session) {
          setError('This password reset link is invalid or expired. Request a new link to continue.');
          return;
        }
        setRecoveryReady(true);
      }).catch(() => {
        if (active) setError('Unable to verify this reset link. Request a new link to continue.');
      });
    } catch {
      setError('Password reset is not configured. Please contact support.');
    }
    return () => { active = false; };
  }, []);

  const onSubmit = async (data: z.infer<typeof ResetSchema>) => {
    setSubmitting(true);
    setError(null);
    try {
      const { error: supabaseError } = await getSupabase().auth.updateUser({ password: data.password });
      if (supabaseError) throw supabaseError;
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2">
          <VeyraLogo size="md" />
          <span className="text-xl font-bold tracking-tight text-veyra-navy">VEYRA</span>
        </div>
        {done ? (
          <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Lock className="h-6 w-6 text-emerald-700" aria-hidden="true" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-veyra-navy">Password updated</h1>
            <p className="mb-6 text-sm text-muted-foreground">You can now sign in with your new password.</p>
            <Link href="/login"><Button>Sign in</Button></Link>
          </section>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold text-veyra-navy">Reset password</h1>
            <p className="mb-8 text-sm text-muted-foreground">Choose a new password for your VEYRA account.</p>
            {error && <div role="alert" className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
            {!recoveryReady && !error && <p role="status" className="mb-6 text-sm text-muted-foreground">Verifying your reset link…</p>}
            {recoveryReady ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">New password</label>
                  <input id="password" {...form.register('password')} type="password" autoComplete="new-password" className="input" />
                  {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm new password</label>
                  <input id="confirmPassword" {...form.register('confirmPassword')} type="password" autoComplete="new-password" className="input" />
                  {form.formState.errors.confirmPassword && <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Updating…' : 'Update password'}
                </Button>
              </form>
            ) : error ? (
              <Link href="/forgot-password" className="text-sm font-medium text-veyra-indigo hover:underline">Request a new reset link</Link>
            ) : null}
          </>
        )}
        {!done && <p className="mt-8 text-center text-sm text-muted-foreground">Remember your password? <Link href="/login" className="font-medium text-veyra-indigo hover:underline">Sign in</Link></p>}
      </div>
    </div>
  );
}