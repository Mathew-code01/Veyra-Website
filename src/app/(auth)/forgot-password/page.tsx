'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { passwordRecoveryAction } from '@/app/(auth)/actions';
import { Mail, CheckCircle2 } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';

const ForgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof ForgotSchema>>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: z.infer<typeof ForgotSchema>) => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append('email', data.email);
    const result = await passwordRecoveryAction(fd);
    setSubmitting(false);
    setMessage(result?.message ?? 'If an account exists with that email, a password reset link has been sent.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <VeyraLogo size="md" />
          <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
        </div>
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Forgot password</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your email and we will send password reset instructions.
        </p>

        {message && (
          <div role="status" className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="leading-snug">
              <p className="font-medium">{message}</p>
              <p className="mt-1 text-xs text-emerald-700">Check your spam folder if you don't see it within a few minutes.</p>
            </div>
          </div>
        )}

        {!message && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            <Button type="submit" className="w-full h-11" disabled={submitting}>
              {submitting ? 'Sending instructions…' : 'Send reset instructions'}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="text-veyra-indigo font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
