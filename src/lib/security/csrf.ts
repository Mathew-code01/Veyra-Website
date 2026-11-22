// ============================================================================
// FILE: src/lib/security/csrf.ts
//
// PURPOSE:
// CSRF protection for Next.js Server Actions using double-submit cookie pattern.
// ============================================================================

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const CSRF_COOKIE_NAME = 'veyra_csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('base64url');
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CSRF_TOKEN_EXPIRY_MS / 1000,
  });
  return token;
}

export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value ?? null;
}

export async function validateCsrfToken(
  submittedToken: string | null | undefined,
): Promise<boolean> {
  if (!submittedToken || typeof submittedToken !== 'string') {
    return false;
  }

  const storedToken = await getCsrfToken();
  if (!storedToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (submittedToken.length !== storedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < submittedToken.length; i++) {
    result |= submittedToken.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }

  return result === 0;
}

export async function consumeCsrfToken(
  submittedToken: string | null | undefined,
): Promise<boolean> {
  const isValid = await validateCsrfToken(submittedToken);
  if (isValid) {
    const cookieStore = await cookies();
    cookieStore.delete(CSRF_COOKIE_NAME);
  }
  return isValid;
}

export function getCsrfHeaderName(): string {
  return CSRF_HEADER_NAME;
}