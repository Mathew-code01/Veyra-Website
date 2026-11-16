import { appUrl } from '@/lib/env';

const ALLOWED_PATHS = new Set([
  '/',
  '/login',
  '/register',
  '/callback',
  '/reset-password',
  '/dashboard',
  '/dashboard/settings',
  '/download',
  '/pricing',
]);

/**
 * Validate a redirect destination against a trusted allowlist.
 * Only relative paths (same-origin) and the configured appUrl origin are allowed.
 * Prevents open redirects.
 */
export function isTrustedRedirect(to: string | null | undefined): boolean {
  if (!to) return false;

  // Relative path — allowed if it is in the allowlist and has no protocol/host
  if (to.startsWith('/') && !to.startsWith('//')) {
    return ALLOWED_PATHS.has(to);
  }

  try {
    const url = new URL(to);
    // Only same-origin absolute URLs are trusted
    return url.origin === new URL(appUrl).origin && ALLOWED_PATHS.has(url.pathname);
  } catch {
    return false;
  }
}

export function getSafeRedirect(to: string | null | undefined, fallback = '/'): string {
  return isTrustedRedirect(to) ? (to as string) : fallback;
}
