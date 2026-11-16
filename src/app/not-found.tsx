import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-5 py-16 text-slate-950">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_24px_80px_-52px_rgba(30,41,59,0.35)] sm:p-12">
        <div className="mx-auto flex w-fit items-center gap-2"><VeyraLogo size="sm" /><span className="text-sm font-bold tracking-tight">VEYRA</span></div>
        <div className="mx-auto mt-10 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700"><Compass size={24} /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Page not found</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page has moved or does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Return to VEYRA and continue exploring the desktop copilot and account services.</p>
        <Link href="/" className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white transition hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"><ArrowLeft size={16} />Back to VEYRA</Link>
      </section>
    </main>
  );
}
