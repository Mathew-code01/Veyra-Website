// Standardized error envelope returned by the Platform API.
// See packages/contracts/src/index.ts ErrorResponseSchema.

export interface PlatformErrorResponse {
  ok: false;
  requestId: string;
  error: {
    code: string;
    message: string;
    status: number;
    details?: Record<string, unknown>;
  };
}

export interface VeyraApiError {
  code: string;
  message: string;
  status: number;
  requestId: string;
  details?: Record<string, unknown>;
}

export function normalizeError(
  err: unknown,
  fallbackMessage = 'An unexpected error occurred.',
): VeyraApiError {
  if (err && typeof err === 'object' && 'status' in err && 'code' in err) {
    const e = err as Partial<VeyraApiError>;
    return {
      code: e.code || 'UNKNOWN_ERROR',
      message: e.message || fallbackMessage,
      status: (e.status as number) || 500,
      requestId: (e.requestId as string) || 'unknown',
      details: e.details,
    };
  }

  // Platform error envelope: { ok: false, requestId, error: {...} }
  if (err && typeof err === 'object' && 'error' in err) {
    const e = err as PlatformErrorResponse;
    return {
      code: e.error?.code || 'UNKNOWN_ERROR',
      message: e.error?.message || fallbackMessage,
      status: e.error?.status || 500,
      requestId: e.requestId || 'unknown',
      details: e.error?.details,
    };
  }

  // Network / fetch errors
  if (err instanceof TypeError && err.message && err.message.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the Veyra Platform. Please check your connection and try again.',
      status: 0,
      requestId: 'unknown',
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: fallbackMessage,
    status: 500,
    requestId: 'unknown',
  };
}

export function isAuthError(err: VeyraApiError): boolean {
  return err.status === 401 || err.code === 'UNAUTHORIZED' || err.code === 'REFRESH_FAILED';
}

export function isPermissionError(err: VeyraApiError): boolean {
  return err.status === 403 || err.code === 'FORBIDDEN';
}

export function isNotFound(err: VeyraApiError): boolean {
  return err.status === 404 || err.code === 'NOT_FOUND';
}

export function isRateLimited(err: VeyraApiError): boolean {
  return err.status === 429 || err.code === 'RATE_LIMITED';
}

export function userFriendlyMessage(err: VeyraApiError): string {
  // Never leak internal details, database messages, or server exceptions.
  // Map known codes and messages to safe user messages.
  const rawLower = (err.message || '').toLowerCase();

  // Check for email enumeration or raw Supabase strings
  if (
    rawLower.includes('email not found') ||
    rawLower.includes('invalid login credentials') ||
    rawLower.includes('invalid email or password') ||
    rawLower.includes('user not found')
  ) {
    return "We couldn't sign you in with those details. Check your information and try again.";
  }

  if (rawLower.includes('user already registered') || rawLower.includes('already exists')) {
    return 'An account with this email address already exists. Try signing in instead.';
  }

  if (rawLower.includes('email not confirmed') || rawLower.includes('email_not_confirmed')) {
    return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
  }

  if (rawLower.includes('failed to fetch') || rawLower.includes('networkerror') || rawLower.includes('econnrefused')) {
    return "We're having trouble connecting. Check your internet connection and try again.";
  }

  if (rawLower.includes('timed out') || rawLower.includes('timeout') || rawLower.includes('aborted')) {
    return 'This is taking longer than expected. You can try again.';
  }

  switch (err.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect. Check your internet connection and try again.';
    case 'VALIDATION_ERROR':
      return 'Please check the information you entered and try again.';
    case 'UNAUTHORIZED':
    case 'REFRESH_FAILED':
      return 'Your session has expired. Please sign in again.';
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action.';
    case 'NOT_FOUND':
      return 'The requested item could not be found.';
    case 'RATE_LIMITED':
      return 'Too many requests. Please wait a moment and try again.';
    case 'LOGIN_FAILED':
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password. Check your information and try again.';
    case 'REGISTRATION_FAILED':
      return 'Unable to create your account. Please check your information and try again.';
    case 'USER_ALREADY_EXISTS':
      return 'An account with this email address already exists. Try signing in instead.';
    case 'EMAIL_NOT_CONFIRMED':
      return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
    case 'TRANSACTION_EXPIRED':
    case 'AUTH_EXPIRED':
      return 'Your sign-in session expired before it was completed. Start again to continue.';
    case 'AUTH_CANCELLED':
      return "Sign-in wasn't completed. You can return to VEYRA and try again whenever you're ready.";
    case 'RESERVATION_FAILED':
    case 'SETTLEMENT_FAILED':
      return 'Unable to process your request. Please check your balance and try again.';
    case 'CHECKOUT_ERROR':
      return 'Unable to start checkout. Please try again.';
    case 'DOWNLOAD_AUTH_ERROR':
      return 'Unable to authorize this download. Please try again.';
    case 'OAUTH_CALLBACK_ERROR':
    case 'OAUTH_AUTHORIZE_ERROR':
      return 'Unable to complete sign-in with that provider. Please try again or use email and password.';
    case 'PROVIDER_NOT_CONFIGURED':
      return 'That sign-in provider is not currently configured. Please use email/password instead.';
    case 'DEVICE_REGISTRATION_ERROR':
    case 'DEVICE_AUTHORIZATION_ERROR':
    case 'DEVICE_REVOCATION_ERROR':
      return 'Unable to manage your device. Please try again.';
    default:
      if (err.status >= 500) {
        return 'VEYRA is temporarily unavailable. Please try again shortly.';
      }
      return err.message && !err.message.includes('Internal')
        ? err.message
        : 'An unexpected error occurred. Please try again.';
  }
}
