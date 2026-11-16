import type { ReactNode } from 'react';
import { ArrowRight, AudioLines, BookOpenCheck, LockKeyhole, Sparkles } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] lg:grid lg:grid-cols-[0.96fr_1.04fr]">
      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        {children}
      </section>
      <aside className="relative hidden overflow-hidden bg-[radial-gradient(ellipse_at_78%_22%,rgba(143,126,255,0.32),transparent_34%),linear-gradient(145deg,#f1f0ff_0%,#fafaff_48%,#edf3ff_100%)] p-10 lg:flex lg:items-center lg:justify-center xl:p-14">
        <div aria-hidden="true" className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-violet-300/35 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-200/55 blur-3xl" />
        <div className="relative w-full max-w-xl">
          <div className="mb-10 flex items-center gap-2.5"><VeyraLogo size="md" /><span className="text-lg font-bold tracking-tight text-slate-950">VEYRA</span></div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Your interview workspace</p>
          <h2 className="mt-3 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950">Prepare with your experience. Show up as yourself.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">Practice before the interview, organize the context you choose to use, and keep optional Desktop guidance close at hand.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/90 bg-white/85 p-5 shadow-[0_32px_85px_-50px_rgba(37,33,91,0.46)] ring-1 ring-indigo-950/[0.06] backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Sparkles className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-slate-900">A clearer path to interview day</p><p className="mt-1 text-xs text-slate-500">A product preview, not a running session</p></div></div><ArrowRight className="h-4 w-4 text-slate-400" /></div>
            <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-200 bg-white p-3.5"><BookOpenCheck className="h-4 w-4 text-indigo-700" /><p className="mt-3 text-xs font-semibold text-slate-800">Practice with context</p><p className="mt-1 text-[11px] leading-4 text-slate-500">Select the details that matter to your answer.</p></div><div className="rounded-xl border border-slate-200 bg-white p-3.5"><AudioLines className="h-4 w-4 text-indigo-700" /><p className="mt-3 text-xs font-semibold text-slate-800">Support on Desktop</p><p className="mt-1 text-[11px] leading-4 text-slate-500">Capture stays off until you enable it.</p></div></div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] text-slate-600"><LockKeyhole className="h-3.5 w-3.5 text-indigo-700" />Local or cloud processing, based on your choices and provider.</div>
          </div>
        </div>
      </aside>
    </main>
  );
}