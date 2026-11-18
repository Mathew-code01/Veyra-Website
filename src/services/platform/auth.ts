// Cookie-based session management for the Veyra Website.
// Tokens are stored in secure, same-site cookies (never localStorage).
// Access token is readable by client JS (same-site, secure) for direct API calls.
// Refresh token is httpOnly (server-only).

import { getTrustedRedirectOrigins } from '@/lib/env';
import { getSafeRedirect } from '@/lib/security/redirects';

const ACCESS_TOKEN_COOKIE = 'veyra_access_token';
const REFRESH_TOKEN_COOKIE = 'veyra_refresh_token';
const OAUTH_STATE_COOKIE = 'veyra_oauth_state';
const OAUTH_REDIRECT_COOKIE = 'veyra_oauth_redirect';
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

type AuthCookieOptions = {
  path: string;
  maxAge: number;
  secure: boolean;
  sameSite: 'strict' | 'lax';
  httpOnly?: boolean;
};

type AuthCookieStore = {
  set(name: string, value: string, options: AuthCookieOptions): unknown;
};

export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    emailConfirmed: boolean;
    provider?: string | null;
    isNewUser?: boolean;
  } | null;
  expiresIn: number | null;
};

/**
 * Parse the access token from document.cookie (client-side).
 * Returns null if not present.
 */
export function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  return getCookie(ACCESS_TOKEN_COOKIE);
}

/**
 * Parse the refresh token from cookies (server-side only, httpOnly).
 * Client-side JS cannot read httpOnly cookies.
 */
export function getRefreshTokenFromCookie(cookieHeader?: string): string | null {
  const source = cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  return getCookieFromString(REFRESH_TOKEN_COOKIE, source);
}

/**
 * Build a full Session from cookies. Used by client components and server actions.
 */
export function getSessionFromCookie(cookieHeader?: string): Session {
  const source = cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  const accessToken = getCookieFromString(ACCESS_TOKEN_COOKIE, source);
  const refreshToken = getCookieFromString(REFRESH_TOKEN_COOKIE, source);

  // User info is not stored in cookies (privacy). It's fetched via /auth/me when needed.
  return {
    accessToken,
    refreshToken,
    user: null,
    expiresIn: null,
  };
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }
  return null;
}

function getCookieFromString(name: string, cookieString: string): string | null {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }
  return null;
}

/**
 * Build Set-Cookie header strings for access + refresh tokens after login.
 * accessToken: secure, sameSite=strict, path=/, max-age short (NOT httpOnly so client can read)
 * refreshToken: secure, sameSite=strict, path=/, httpOnly, max-age longer
 */
export function writeTokenCookies(
  cookieStore: AuthCookieStore,
  accessToken: string,
  refreshToken: string,
  accessMaxAgeSeconds: number,
  refreshMaxAgeSeconds: number = REFRESH_TOKEN_MAX_AGE,
): void {
  const isSecure = process.env.NODE_ENV === 'production';
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    path: '/',
    maxAge: accessMaxAgeSeconds,
    secure: isSecure,
    sameSite: 'strict',
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    path: '/',
    maxAge: refreshMaxAgeSeconds,
    secure: isSecure,
    sameSite: 'strict',
    httpOnly: true,
  });
}

/**
 * Clear both session cookies using the same scope and security attributes.
 */
export function clearTokenCookies(cookieStore: AuthCookieStore): void {
  const options = {
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };
  cookieStore.set(ACCESS_TOKEN_COOKIE, '', options);
  cookieStore.set(REFRESH_TOKEN_COOKIE, '', { ...options, httpOnly: true });
}

export function writeOAuthStateCookie(cookieStore: AuthCookieStore, state: string): void {
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    path: '/callback',
    maxAge: 10 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  });
}

export function writeOAuthRedirectCookie(cookieStore: AuthCookieStore, redirectTo: string): void {
  cookieStore.set(OAUTH_REDIRECT_COOKIE, getSafeRedirect(redirectTo, '/dashboard'), {
    path: '/callback', maxAge: 10 * 60, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', httpOnly: true,
  });
}

export function clearOAuthRedirectCookie(cookieStore: AuthCookieStore): void {
  cookieStore.set(OAUTH_REDIRECT_COOKIE, '', {
    path: '/callback', maxAge: 0, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', httpOnly: true,
  });
}

export function clearOAuthStateCookie(cookieStore: AuthCookieStore): void {
  cookieStore.set(OAUTH_STATE_COOKIE, '', {
    path: '/callback',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  });
}

/**
 * Validate a post-action redirect URL against the trusted allowlist.
 * Never redirect to an untrusted external destination.
 */
export function validateRedirect(to: string | null | undefined): string {
  return getSafeRedirect(to, '/');
}

/**
 * Returns trusted redirect origins for building allowlisted callbacks.
 */
export function trustedOrigins() {
  return getTrustedRedirectOrigins();
}
