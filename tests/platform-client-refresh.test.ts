import { afterEach, describe, expect, it, vi } from 'vitest';
import { VeyraPlatformClient } from '@/services/platform/client';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Platform client session refresh', () => {
  it('retries an authenticated request once with the rotated access token', async () => {
    let accessToken = 'expired-token';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Expired', status: 401 } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, requestId: 'request-1', balance: { balanceCents: 0, currency: 'USD' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const client = new VeyraPlatformClient({
      baseUrl: 'https://api.example.test',
      getToken: () => accessToken,
      onTokenExpired: async () => {
        accessToken = 'rotated-token';
        return true;
      },
    });

    await expect(client.getCreditBalance()).resolves.toMatchObject({
      balance: { balanceCents: 0, currency: 'USD' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer expired-token',
    });
    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      Authorization: 'Bearer rotated-token',
    });
  });
});
