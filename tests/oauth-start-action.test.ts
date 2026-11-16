import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VeyraPlatformClient } from '@/services/platform/client';

const { cookieSet, redirectMock } = vi.hoisted(() => ({
  cookieSet: vi.fn(),
  redirectMock: vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`); }),
}));

vi.mock('next/headers', () => ({ cookies: vi.fn(async () => ({ set: cookieSet })) }));
vi.mock('next/navigation', () => ({ redirect: (url: string) => redirectMock(url) }));

import { oauthStartAction } from '@/app/(auth)/actions';

describe('oauthStartAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not send the Website relative redirect path to Platform', async () => {
    const authorize = vi.spyOn(VeyraPlatformClient.prototype, 'oauthAuthorize').mockResolvedValue({
      ok: true,
      requestId: 'request-1',
      provider: 'google',
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?state=opaque',
      state: 'opaque',
    } as never);
    const form = new FormData();
    form.set('provider', 'google');
    form.set('redirectTo', '/dashboard');

    await expect(oauthStartAction(form)).rejects.toThrow('NEXT_REDIRECT:');
    expect(authorize).toHaveBeenCalledWith({ provider: 'google' });
    expect(cookieSet).toHaveBeenCalled();
  });

  it('returns provider availability errors instead of throwing a server runtime error', async () => {
    vi.spyOn(VeyraPlatformClient.prototype, 'oauthAuthorize').mockRejectedValue({
      code: 'PROVIDER_NOT_CONFIGURED',
      message: 'OAuth provider not configured: github',
      status: 400,
      requestId: 'request-2',
    });
    const form = new FormData();
    form.set('provider', 'github');

    await expect(oauthStartAction(form)).resolves.toMatchObject({
      error: 'That sign-in provider is not currently configured. Please use email/password instead.',
      code: 'PROVIDER_NOT_CONFIGURED',
    });
  });
});
