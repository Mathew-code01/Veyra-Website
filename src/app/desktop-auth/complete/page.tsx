import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Return to VEYRA Desktop' };

export default async function DesktopAuthComplete({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const authorized = params.status === 'authorized';

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] p-6 text-center">
      <section className="w-full max-w-md rounded-2xl border border-[#e4e7f0] bg-white p-9 shadow-xl shadow-indigo-950/5">
        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
            authorized ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {authorized ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <AlertCircle className="h-8 w-8" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-bold text-veyra-navy">
          {authorized ? 'Desktop connected successfully' : 'Sign-in session expired'}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#5b6782]">
          {authorized
            ? 'Your VEYRA Desktop app is now connected. Return to the desktop app — it will finish signing in automatically.'
            : 'This sign-in request expired before it was completed. Return to VEYRA Desktop and start sign-in again.'}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/dashboard">
            <Button variant={authorized ? 'outline' : 'default'} className="w-full h-10 text-xs">
              Go to Website Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
