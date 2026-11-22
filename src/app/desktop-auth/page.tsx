import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { VeyraPlatformClient } from '@/services/platform/client';
import { apiBaseUrl } from '@/lib/env';
import { writeTokenCookies } from '@/services/platform/auth';
import { authorizeDesktopAction } from './actions';
import { VeyraLogo } from '@/components/marketing/logo';
import { ShieldCheck, Laptop, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Connect VEYRA Desktop' };

export default async function DesktopAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) {
  const params = await searchParams;
  const id = params.transactionId ?? '';

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return (
      <Message
        title="Invalid sign-in request"
        text="This desktop sign-in request is not valid. Please return to VEYRA Desktop and start sign-in again."
      />
    );
  }

  const cookieStore = await cookies();
  let token = cookieStore.get('veyra_access_token')?.value;

  if (!token) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/desktop-auth?transactionId=${id}`)}`);
  }

  let client = new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => token });

  try {
    let account;
    try {
      account = await client.getProfile();
    } catch {
      const refreshToken = cookieStore.get('veyra_refresh_token')?.value;
      if (!refreshToken) throw new Error('Session expired');
      const refreshed = await new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => null }).refresh(
        refreshToken,
      );
      writeTokenCookies(cookieStore, refreshed.accessToken, refreshed.refreshToken, refreshed.expiresIn);
      token = refreshed.accessToken;
      client = new VeyraPlatformClient({ baseUrl: apiBaseUrl, getToken: () => token });
      account = await client.getProfile();
    }

    const request = await client.getDesktopAuthRequest(id);

    return (
      <main className="min-h-screen bg-[#f7f8fc] px-5 py-16 text-[#0f1b3d] flex items-center justify-center">
        <section className="w-full max-w-lg rounded-2xl border border-[#e4e7f0] bg-white p-8 shadow-xl shadow-indigo-950/5">
          <div className="mb-6 flex items-center gap-3">
            <VeyraLogo size="md" className="h-10 w-10" />
            <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-[.15em] text-veyra-indigo">
            <Laptop className="h-4 w-4" />
            <span>Desktop Sign-in</span>
          </div>

          <h1 className="text-2xl font-bold text-veyra-navy">Authorize this device?</h1>

          <p className="mt-3 text-sm leading-relaxed text-[#5b6782]">
            You are authorizing VEYRA Desktop to connect to your account as{' '}
            <strong className="text-[#0f1b3d] font-semibold">{account.profile.email}</strong>.
            Your session is encrypted end-to-end for this installation.
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-[#5b6782]">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <span>
              Request expires at <strong>{new Date(request.expiresAt).toLocaleTimeString()}</strong>.
            </span>
          </div>

          <form action={authorizeDesktopAction} className="mt-6">
            <input type="hidden" name="transactionId" value={id} />
            <input type="hidden" name="confirm" value="yes" />
            <Button type="submit" className="w-full h-11 text-sm font-semibold">
              Authorize VEYRA Desktop
            </Button>
          </form>

          <Link
            href="/dashboard"
            className="mt-4 block text-center text-sm text-[#5b6782] hover:text-[#0f1b3d] font-medium transition-colors"
          >
            Cancel and return to dashboard
          </Link>
        </section>
      </main>
    );
  } catch {
    return (
      <Message
        title="Sign-in request expired"
        text="This desktop sign-in request has expired or could not be verified. Return to VEYRA Desktop and start sign-in again."
      />
    );
  }
}

function Message({ title, text }: { title: string; text: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] p-6">
      <section className="w-full max-w-md rounded-2xl border border-[#e4e7f0] bg-white p-8 text-center shadow-xl shadow-indigo-950/5">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-veyra-navy">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6782]">{text}</p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="outline" className="h-10 text-xs font-medium">
              Return to VEYRA
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
