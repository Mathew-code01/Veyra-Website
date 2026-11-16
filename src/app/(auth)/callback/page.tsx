import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';
import { clearOAuthStateCookie, writeTokenCookies } from '@/services/platform/auth';

export const metadata = {
  title: 'Sign in',
  description: 'Completing sign-in…',
};

export default async function OAuthCallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const provider = String(searchParams.provider ?? '');
  const code = String(searchParams.code ?? '');
  const state = String(searchParams.state ?? '');
  const error = String(searchParams.error ?? '');
  const errorDescription = String(searchParams.error_description ?? '');

  if (error) {
    clearOAuthStateCookie(cookieStore);
    redirect(`/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  const expectedState = cookieStore.get('veyra_oauth_state')?.value;
  clearOAuthStateCookie(cookieStore);
  if (
    (provider !== 'google' && provider !== 'github') ||
    !code ||
    !state ||
    !expectedState ||
    state !== expectedState
  ) {
    redirect('/login?error=invalid_oauth_response');
  }

  let result: Awaited<ReturnType<VeyraPlatformClient['oauthCallback']>>;
  try {
    const client = new VeyraPlatformClient({
      baseUrl: apiBaseUrl,
      getToken: () => null,
    });

    result = await client.oauthCallback({
      provider: provider as 'google' | 'github',
      code,
      state,
    });
  } catch {
    redirect('/login?error=oauth_callback_failed');
  }

  writeTokenCookies(cookieStore, result.accessToken, result.refreshToken, result.expiresIn);
  redirect('/dashboard');
}
