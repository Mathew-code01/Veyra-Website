import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';
import { writeTokenCookies } from '@/services/platform/auth';
import { authorizeDesktopAction } from './actions';

export const metadata = { title: 'Connect VEYRA Desktop' };

export default async function DesktopAuthPage({ searchParams }: { searchParams: Promise<{ transactionId?: string }> }) {
  const params = await searchParams;
  const id = params.transactionId ?? '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return <Message title="Invalid sign-in request" text="Start sign-in again from VEYRA Desktop." />;
  const cookieStore = await cookies();
  let token = cookieStore.get('veyra_access_token')?.value;
  if (!token) redirect(`/login?redirectTo=${encodeURIComponent(`/desktop-auth?transactionId=${id}`)}`);
  let client = new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => token });
  try {
    let account;
    try { account = await client.getProfile(); }
    catch {
      const refreshToken = cookieStore.get('veyra_refresh_token')?.value;
      if (!refreshToken) throw new Error('Session expired');
      const refreshed = await new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => null }).refresh(refreshToken);
      writeTokenCookies(cookieStore, refreshed.accessToken, refreshed.refreshToken, refreshed.expiresIn);
      token = refreshed.accessToken;
      client = new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => token });
      account = await client.getProfile();
    }
    const request = await client.getDesktopAuthRequest(id);
    return <main className="min-h-screen bg-[#f6f5fb] px-5 py-16 text-[#17172f]"><section className="mx-auto max-w-lg rounded-2xl border border-[#e8e5f2] bg-white p-8 shadow-xl shadow-indigo-950/5">
      <div className="mb-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white">V</span><span className="font-semibold tracking-wide">VEYRA</span></div>
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">Desktop sign-in</p><h1 className="mt-2 text-2xl font-semibold">Connect this device?</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">You are authorizing VEYRA Desktop to sign in as <strong className="text-slate-900">{account.profile.email}</strong>. The session will be encrypted for this Desktop installation and exchanged once.</p>
      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Request expires {new Date(request.expiresAt).toLocaleTimeString()}.</p>
      <form action={authorizeDesktopAction} className="mt-6"><input type="hidden" name="transactionId" value={id}/><input type="hidden" name="confirm" value="yes"/><button className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">Continue to VEYRA Desktop</button></form>
      <Link href="/dashboard" className="mt-4 block text-center text-sm text-slate-500 hover:text-slate-800">Cancel and return to VEYRA</Link>
    </section></main>;
  } catch { return <Message title="Request unavailable" text="This Desktop sign-in request expired or could not be verified. Start again from VEYRA Desktop."/>; }
}

function Message({ title, text }: { title: string; text: string }) { return <main className="grid min-h-screen place-items-center bg-[#f6f5fb] p-6"><section className="max-w-md rounded-2xl border bg-white p-8 shadow-xl"><h1 className="text-xl font-semibold">{title}</h1><p className="mt-3 text-sm text-slate-600">{text}</p><Link className="mt-5 inline-block text-sm font-medium text-indigo-600" href="/">Return to VEYRA</Link></section></main>; }
