import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';
import { clearOAuthRedirectCookie, clearOAuthStateCookie, writeTokenCookies } from '@/services/platform/auth';
import { isTrustedRedirect } from '@/lib/security/redirects';

export const metadata = {
  title: 'Sign in',
  description: 'Completing sign-in…',
};

export default async function OAuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const provider = String(params.provider ?? '');
  const code = String(params.code ?? '');
  const state = String(params.state ?? '');
  const error = String(params.error ?? '');
  const errorDescription = String(params.error_description ?? '');

  if (error) {
    clearOAuthStateCookie(cookieStore);
    clearOAuthRedirectCookie(cookieStore);
    redirect(`/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  const expectedState = cookieStore.get('veyra_oauth_state')?.value;
  const requestedRedirect = cookieStore.get('veyra_oauth_redirect')?.value;
  const destination = isTrustedRedirect(requestedRedirect) ? requestedRedirect! : '/dashboard';
  clearOAuthStateCookie(cookieStore);
  clearOAuthRedirectCookie(cookieStore);
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
  redirect(destination);
}
