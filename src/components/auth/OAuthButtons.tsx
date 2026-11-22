'use client';

import { useEffect, useState, useTransition } from 'react';
import { oauthStartAction } from '@/app/(auth)/actions';
import { useAuth } from '@/components/auth/auth-provider';

export function OAuthButtons({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const { client } = useAuth();
  const [providers, setProviders] = useState<{ google: boolean; github: boolean }>({
    google: false,
    github: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!client) return;
    let active = true;

    void client
      .getOAuthProviders()
      .then((result) => {
        if (!active) return;
        setProviders({
          google: result.providers.find((p) => p.provider === 'google')?.configured ?? false,
          github: result.providers.find((p) => p.provider === 'github')?.configured ?? false,
        });
      })
      .catch(() => {
        if (active) {
          // Gracefully default to unconfigured without showing technical error
          setProviders({ google: false, github: false });
        }
      });

    return () => {
      active = false;
    };
  }, [client]);

  const startOAuth = (provider: 'google' | 'github') => {
    setError(null);
    const isConfigured = providers[provider];

    if (!isConfigured) {
      const name = provider === 'google' ? 'Google' : 'GitHub';
      setError(`${name} sign-in will be enabled soon. Please use email and password to sign in.`);
      return;
    }

    const formData = new FormData();
    formData.set('provider', provider);
    formData.set('redirectTo', redirectTo);

    startTransition(async () => {
      try {
        const result = await oauthStartAction(formData);
        if (result?.error) {
          setError(result.error);
        }
      } catch {
        setError('Unable to start sign-in. Check your connection and try again.');
      }
    });
  };

  return (
    <section className="mt-8" aria-label="Social sign-in options">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => startOAuth('google')}
          disabled={pending}
          className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#4285F4"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#F4B400"
              d="M5.84 14.09c-.22-.66-.36-1.39-.36-2.19s.13-1.53.36-2.19H2.18v2.84c1.21 1.16 2.86 1.84 4.66 1.84 2.43 0 4.49-1.67 5.15-3.83H5.84z"
            />
            <path
              fill="#0F9D58"
              d="M7.55 9.53C7.55 7.2 9.46 5.29 12 5.29v2.84c-1.16 0-2.14.6-2.76 1.48l-2.76-2.23C4.09 7.48 2.18 9.88 2.18 12.81c0 2.35 1.2 4.49 3.28 6.01l3.57-2.77c-.87-1.02-1.39-2.28-1.39-3.63zM12 7.05c-2.64 0-4.81 2.04-5.15 4.53H2.18v-2.84C3.99 7.47 7.7 5.29 12 5.29c2.43 0 4.49 1.67 5.15 3.83h1.85V7.05z"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => startOAuth('github')}
          disabled={pending}
          className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.301 3.495.998.108-.776.417-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.465-2.38 1.235-3.22-1.335-.25-2.245-1.49-1.38-2.38 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645-.89 1.065-2.13.845-3.22 0-.06.015-.12.015-.13 0-.275-.015-.55-.02-.825A10.007 10.007 0 0 1 12 2.975z"
            />
          </svg>
          GitHub
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900 leading-relaxed text-center">
          {error}
        </p>
      )}
    </section>
  );
}
