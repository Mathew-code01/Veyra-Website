import type { ReactNode } from 'react';
import { ArrowRight, AudioLines, BookOpenCheck, LockKeyhole, Sparkles } from 'lucide-react';
import { VeyraLogo } from '@/components/marketing/logo';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f8fc] lg:grid lg:grid-cols-[0.96fr_1.04fr]">
      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12 bg-[#f7f8fc]">
        {children}
      </section>
      <aside className="relative hidden overflow-hidden border-l border-[#e4e7f0] bg-gradient-to-br from-[#f5f2ff] via-[#f7f8fc] to-[#edeaff]/50 p-10 lg:flex lg:items-center lg:justify-center xl:p-14">
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#d6cbff]/30 blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#eae4ff]/50 blur-3xl pointer-events-none" />
        <div className="relative w-full max-w-xl">
          <div className="mb-10 flex items-center gap-2.5">
            <VeyraLogo size="md" />
            <span className="text-lg font-bold tracking-tight text-veyra-navy">VEYRA</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">Your interview workspace</p>
          <h2 className="mt-3 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-veyra-navy">
            Prepare with your experience. Show up as yourself.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
            Practice before the interview, organize the context you choose to use, and keep optional Desktop guidance close at hand.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/90 bg-white/85 p-5 shadow-[0_32px_85px_-50px_rgba(37,33,91,0.25)] ring-1 ring-indigo-950/[0.04] backdrop-blur">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-veyra-indigo">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">A clearer path to interview day</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">A product preview, not a running session</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/80 bg-white p-3.5 shadow-sm">
                <BookOpenCheck className="h-4 w-4 text-veyra-indigo" />
                <p className="mt-3 text-xs font-semibold text-foreground">Practice with context</p>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Select the details that matter to your answer.</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-white p-3.5 shadow-sm">
                <AudioLines className="h-4 w-4 text-veyra-indigo" />
                <p className="mt-3 text-xs font-semibold text-foreground">Support on Desktop</p>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Capture stays off until you enable it.</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2.5 text-[11px] text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5 text-veyra-indigo" />
              Local or cloud processing, based on your choices and provider.
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}