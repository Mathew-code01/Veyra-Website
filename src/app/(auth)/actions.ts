'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';
import { clearOAuthStateCookie, clearTokenCookies, writeOAuthStateCookie, writeOAuthRedirectCookie, writeTokenCookies } from '@/services/platform/auth';
import { isTrustedRedirect } from '@/lib/security/redirects';
import { userFriendlyMessage, normalizeError } from '@/services/platform/errors';

function getClient() {
  return new VeyraPlatformClient({
    baseUrl: apiBaseUrl,
    getToken: () => null,
  });
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string | null;

  const safeRedirect = isTrustedRedirect(redirectTo) ? (redirectTo ?? '/') : '/';

  let result: Awaited<ReturnType<VeyraPlatformClient['login']>>;
  try {
    const client = getClient();
    result = await client.login(email, password);
    writeTokenCookies(await cookies(), result.accessToken, result.refreshToken, result.expiresIn);
  } catch (err: any) {
    return { error: err?.message ?? 'Login failed. Please try again.' };
  }

  redirect(safeRedirect);
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string | null;

  const safeRedirect = isTrustedRedirect(redirectTo) ? (redirectTo ?? '/') : '/';

  let result: Awaited<ReturnType<VeyraPlatformClient['register']>>;
  try {
    const client = getClient();
    result = await client.register(email, password);
    writeTokenCookies(await cookies(), result.accessToken, result.refreshToken, result.expiresIn);
  } catch (err: any) {
    return { error: err?.message ?? 'Registration failed. Please try again.' };
  }

  redirect(safeRedirect);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('veyra_access_token')?.value;

  try {
    if (token) {
      const client = new VeyraPlatformClient({
        baseUrl: apiBaseUrl,
        getToken: () => token,
      });
      await client.logout();
    }
  } catch {
    // Ignore logout errors — clear session anyway
  }

  clearTokenCookies(cookieStore);

  redirect('/login');
}

export async function refreshSessionAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('veyra_refresh_token')?.value;

  if (!refreshToken) {
    clearTokenCookies(cookieStore);
    return { ok: false as const };
  }

  try {
    const result = await getClient().refresh(refreshToken);
    writeTokenCookies(cookieStore, result.accessToken, result.refreshToken, result.expiresIn);
    return {
      ok: true as const,
      accessToken: result.accessToken,
      user: result.user,
      expiresIn: result.expiresIn,
    };
  } catch {
    clearTokenCookies(cookieStore);
    return { ok: false as const };
  }
}

export async function passwordRecoveryAction(formData: FormData) {
  const email = formData.get('email') as string;
  const client = getClient();
  try {
    await client.passwordRecovery(email);
    return { success: true, message: 'If an account exists, a recovery link has been sent.' };
  } catch (err: any) {
    // Always return success to prevent account enumeration
    return { success: true, message: 'If an account exists, a recovery link has been sent.' };
  }
}

export async function oauthStartAction(formData: FormData) {
  const providerValue = formData.get('provider');
  if (providerValue !== 'google' && providerValue !== 'github') {
    return { error: 'Choose a supported sign-in provider.' };
  }
  const provider = providerValue;
  const redirectValue = String(formData.get('redirectTo') ?? '/dashboard');
  const safeRedirect = isTrustedRedirect(redirectValue) ? redirectValue : '/dashboard';
  const client = getClient();
  // Platform's authorization schema accepts only absolute redirect URLs and
  // currently routes OAuth through the Website callback configured in Supabase.
  // The local post-login destination is handled by that callback, not Platform.
  let result: Awaited<ReturnType<VeyraPlatformClient['oauthAuthorize']>>;
  try {
    result = await client.oauthAuthorize({ provider });
  } catch (error) {
    const normalized = normalizeError(error, 'Unable to start provider sign-in.');
    return { error: userFriendlyMessage(normalized), code: normalized.code };
  }
  writeOAuthStateCookie(await cookies(), result.state);
  writeOAuthRedirectCookie(await cookies(), safeRedirect);
  redirect(result.authorizationUrl);
}
