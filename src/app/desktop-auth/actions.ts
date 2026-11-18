'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createPublicKey, createCipheriv, diffieHellman, generateKeyPairSync, hkdfSync, randomBytes } from 'node:crypto';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';

function b64(value: Buffer | Uint8Array) { return Buffer.from(value).toString('base64url'); }

export async function authorizeDesktopAction(formData: FormData) {
  const transactionId = String(formData.get('transactionId') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(transactionId) || formData.get('confirm') !== 'yes') {
    redirect('/login?error=invalid_desktop_request');
  }
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('veyra_access_token')?.value;
  const refreshToken = cookieStore.get('veyra_refresh_token')?.value;
  if (!accessToken || !refreshToken) redirect(`/login?redirectTo=${encodeURIComponent(`/desktop-auth?transactionId=${transactionId}`)}`);

  const client = new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => accessToken });
  const [request, account] = await Promise.all([client.getDesktopAuthRequest(transactionId), client.getProfile()]);
  if (Date.parse(request.expiresAt) <= Date.now()) redirect('/desktop-auth/complete?status=expired');

  const desktopPublicKey = createPublicKey({ key: Buffer.from(request.devicePublicKey, 'base64url'), format: 'der', type: 'spki' });
  const ephemeral = generateKeyPairSync('x25519');
  const shared = diffieHellman({ privateKey: ephemeral.privateKey, publicKey: desktopPublicKey });
  const key = Buffer.from(hkdfSync('sha256', shared, Buffer.from(transactionId), Buffer.from('veyra-desktop-session-v1'), 32));
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const payload = Buffer.from(JSON.stringify({
    version: 1,
    accessToken,
    refreshToken,
    expiresAt: Date.now() + 5 * 60_000,
    user: { id: account.profile.id, email: account.profile.email, emailConfirmed: false },
  }));
  const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);
  const sessionEnvelope = {
    version: 1 as const,
    ephemeralPublicKey: b64(ephemeral.publicKey.export({ format: 'der', type: 'spki' }) as Buffer),
    iv: b64(iv), tag: b64(cipher.getAuthTag()), ciphertext: b64(ciphertext),
  };
  await client.authorizeDesktopAuth(transactionId, sessionEnvelope);
  redirect('/desktop-auth/complete?status=authorized');
}
