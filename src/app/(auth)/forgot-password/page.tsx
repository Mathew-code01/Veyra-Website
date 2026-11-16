'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { passwordRecoveryAction } from '@/app/(auth)/actions';
import { Mail, Lock } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';

const ForgotSchema = z.object({
  email: z.string().email('Invalid email address'),
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
    setMessage(result?.message ?? 'If an account exists, a recovery link has been sent.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <VeyraLogo size="md" />
          <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
        </div>
        <h2 className="text-3xl font-bold text-veyra-navy mb-2">Forgot password</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your email and we will send password reset instructions.
        </p>

        {message && (
          <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {!message && (
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

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset instructions'}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="text-veyra-indigo font-medium hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-xs text-muted-foreground text-center">
          For security, we never confirm whether an email address exists.
        </p>
      </div>
    </div>
  );
}

