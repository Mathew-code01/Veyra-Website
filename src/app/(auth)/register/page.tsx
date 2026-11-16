'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { registerAction } from '@/app/(auth)/actions';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setError(null);
    const fd = new FormData();
    fd.append('email', data.email);
    fd.append('password', data.password);
    const result = await registerAction(fd);
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
        <h2 className="text-3xl font-bold text-veyra-navy mb-2">Create account</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Join VEYRA and start preparing for your next interview.
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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              {...form.register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="••••••••"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-veyra-indigo hover:underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-veyra-indigo hover:underline">Privacy Policy</Link>.
          </p>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <OAuthButtons redirectTo="/dashboard" />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-veyra-indigo font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

