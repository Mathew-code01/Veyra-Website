import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearOAuthStateCookie,
  clearTokenCookies,
  writeOAuthStateCookie,
  writeTokenCookies,
} from '@/services/platform/auth';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('auth cookie options', () => {
  it('keeps refresh tokens httpOnly and applies production cookie attributes', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const cookieStore = { set: vi.fn() };

    writeTokenCookies(cookieStore, 'access-token', 'refresh-token', 900);

    expect(cookieStore.set).toHaveBeenNthCalledWith(1, 'veyra_access_token', 'access-token', {
      path: '/',
      maxAge: 900,
      secure: true,
      sameSite: 'strict',
    });
    expect(cookieStore.set).toHaveBeenNthCalledWith(2, 'veyra_refresh_token', 'refresh-token', {
      path: '/',
      maxAge: 604800,
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
  });

  it('clears both cookies with matching scope', () => {
    const cookieStore = { set: vi.fn() };

    clearTokenCookies(cookieStore);

    expect(cookieStore.set).toHaveBeenNthCalledWith(1, 'veyra_access_token', '', {
      path: '/',
      maxAge: 0,
      secure: false,
      sameSite: 'strict',
    });
    expect(cookieStore.set).toHaveBeenNthCalledWith(2, 'veyra_refresh_token', '', {
      path: '/',
      maxAge: 0,
      secure: false,
      sameSite: 'strict',
      httpOnly: true,
    });
  });

  it('binds OAuth state to a short-lived HttpOnly same-site cookie', () => {
    const cookieStore = { set: vi.fn() };

    writeOAuthStateCookie(cookieStore, 'state-token');
    clearOAuthStateCookie(cookieStore);

    expect(cookieStore.set).toHaveBeenNthCalledWith(1, 'veyra_oauth_state', 'state-token', {
      path: '/callback',
      maxAge: 600,
      secure: false,
      sameSite: 'lax',
      httpOnly: true,
    });
    expect(cookieStore.set).toHaveBeenNthCalledWith(2, 'veyra_oauth_state', '', {
      path: '/callback',
      maxAge: 0,
      secure: false,
      sameSite: 'lax',
      httpOnly: true,
    });
  });
});
