export const metadata = { title: 'Return to VEYRA Desktop' };
export default async function DesktopAuthComplete({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const authorized = params.status === 'authorized';
  return <main className="grid min-h-screen place-items-center bg-[#f6f5fb] p-6 text-center"><section className="max-w-md rounded-2xl border border-[#e8e5f2] bg-white p-9 shadow-xl shadow-indigo-950/5"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl text-emerald-600">{authorized ? '✓' : '!'}</div><h1 className="mt-5 text-2xl font-semibold text-[#17172f]">{authorized ? 'Desktop is connected' : 'Sign-in request expired'}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{authorized ? 'Your account is securely connected. Return to VEYRA Desktop; it will finish signing in automatically.' : 'Return to VEYRA Desktop and start sign-in again.'}</p></section></main>;
}
