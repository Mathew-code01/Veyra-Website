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
  // Never leak internal details. Map known codes to safe user messages.
  switch (err.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect to the Veyra Platform. Please check your internet connection and try again.';
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
      return 'Invalid email or password. Please try again.';
    case 'REGISTRATION_FAILED':
      return 'Unable to create your account. Please try again.';
    case 'RESERVATION_FAILED':
    case 'SETTLEMENT_FAILED':
      return 'Unable to process your request. Please check your balance and try again.';
    case 'CHECKOUT_ERROR':
      return 'Unable to start checkout. Please try again.';
    case 'DOWNLOAD_AUTH_ERROR':
      return 'Unable to authorize this download. Please try again.';
    case 'OAUTH_CALLBACK_ERROR':
    case 'OAUTH_AUTHORIZE_ERROR':
      return 'Unable to complete sign-in with that provider. Please try again.';
    case 'PROVIDER_NOT_CONFIGURED':
      return 'That sign-in provider is not currently configured. Please use email/password instead.';
    case 'DEVICE_REGISTRATION_ERROR':
    case 'DEVICE_AUTHORIZATION_ERROR':
    case 'DEVICE_REVOCATION_ERROR':
      return 'Unable to manage your device. Please try again.';
    default:
      return err.message || 'An unexpected error occurred. Please try again.';
  }
}
