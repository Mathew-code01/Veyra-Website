import { describe, it, expect } from 'vitest';
import {
  normalizeError,
  userFriendlyMessage,
  isAuthError,
  isPermissionError,
  isNotFound,
  isRateLimited,
} from '@/services/platform/errors';

describe('error normalization', () => {
  it('normalizes a Platform error envelope', () => {
    const err = normalizeError({
      ok: false,
      requestId: 'req_123',
      error: { code: 'VALIDATION_ERROR', message: 'bad input', status: 400 },
    });
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('bad input');
    expect(err.status).toBe(400);
    expect(err.requestId).toBe('req_123');
  });

  it('normalizes a network error', () => {
    const err = normalizeError(new TypeError('failed to fetch'));
    expect(err.code).toBe('NETWORK_ERROR');
    expect(err.status).toBe(0);
  });

  it('maps unknown errors to a safe message', () => {
    const err = normalizeError({});
    expect(err.code).toBe('UNKNOWN_ERROR');
    expect(err.status).toBe(500);
  });

  it('returns user-friendly messages for known codes', () => {
    expect(userFriendlyMessage({ code: 'NETWORK_ERROR', message: '', status: 0, requestId: 'x' })).toContain(
      'Unable to connect',
    );
    expect(userFriendlyMessage({ code: 'LOGIN_FAILED', message: '', status: 401, requestId: 'x' })).toContain(
      'Invalid email or password',
    );
    expect(userFriendlyMessage({ code: 'FORBIDDEN', message: '', status: 403, requestId: 'x' })).toContain(
      'permission',
    );
    expect(userFriendlyMessage({ code: 'RATE_LIMITED', message: '', status: 429, requestId: 'x' })).toContain(
      'Too many requests',
    );
  });

  it('classifies auth errors', () => {
    expect(isAuthError({ code: 'UNAUTHORIZED', message: '', status: 401, requestId: 'x' })).toBe(true);
    expect(isAuthError({ code: 'REFRESH_FAILED', message: '', status: 401, requestId: 'x' })).toBe(true);
    expect(isAuthError({ code: 'NOT_FOUND', message: '', status: 404, requestId: 'x' })).toBe(false);
  });

  it('classifies permission errors', () => {
    expect(isPermissionError({ code: 'FORBIDDEN', message: '', status: 403, requestId: 'x' })).toBe(true);
    expect(isPermissionError({ code: 'UNAUTHORIZED', message: '', status: 401, requestId: 'x' })).toBe(false);
  });

  it('classifies not-found and rate-limit', () => {
    expect(isNotFound({ code: 'NOT_FOUND', message: '', status: 404, requestId: 'x' })).toBe(true);
    expect(isRateLimited({ code: 'RATE_LIMITED', message: '', status: 429, requestId: 'x' })).toBe(true);
  });
});
