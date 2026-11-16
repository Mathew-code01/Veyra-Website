'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowDownRight,
  ArrowRight,
  AudioLines,
  BookOpenCheck,
  BrainCircuit,
  ChevronRight,
  CircleCheck,
  FileText,
  Gauge,
  LockKeyhole,
  MessageSquareText,
  Mic2,
  Monitor,
  PanelsTopLeft,
  Sparkles,
  Waves,
} from 'lucide-react';
import { gsap } from 'gsap';

const workspaceItems = [
  { label: 'Overview', icon: PanelsTopLeft },
  { label: 'Practice', icon: BrainCircuit, active: true },
  { label: 'Projects', icon: FileText },
  { label: 'Your context', icon: BookOpenCheck },
];

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline();
      timeline
        .from(headlineRef.current, { y: 22, opacity: 0, duration: 0.55, ease: 'power3.out' })
        .from(subheadRef.current, { y: 14, opacity: 0, duration: 0.45, ease: 'power3.out' }, '-=0.2')
        .from(ctaRef.current, { y: 12, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.16')
        .from(visualRef.current, { y: 18, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.25');
      return () => timeline.kill();
    });
    return () => media.revert();
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_78%_42%,rgba(111,91,255,0.12),transparent_36%),linear-gradient(180deg,#fff_0%,#fafaff_72%,#fff_100%)] pt-12 pb-20 sm:pt-16 lg:pt-24 lg:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-36 h-80 w-80 rounded-full bg-indigo-200/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-14 h-[30rem] w-[30rem] rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:px-8">
        <div className="order-2 lg:order-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-indigo-800 shadow-sm shadow-indigo-950/5">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            A desktop copilot for the moments that matter
          </div>
          <h1 ref={headlineRef} className="max-w-[13ch] text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[3.65rem] xl:text-[4.1rem]">
            Walk into your next interview <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">better prepared.</span>
          </h1>
          <p ref={subheadRef} className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Practice with realistic interviews, shape answers around your own experience, and keep optional desktop guidance close when you need it.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/register">
              <Button size="lg" className="h-12 w-full rounded-xl bg-indigo-700 px-6 font-semibold shadow-lg shadow-indigo-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-800 sm:w-auto">
                Create your account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="h-12 w-full rounded-xl border-slate-300 bg-white/75 px-5 font-semibold text-slate-800 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white sm:w-auto">
                See how VEYRA works <ArrowDownRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex max-w-xl items-start gap-3 border-t border-slate-200/80 pt-5 text-sm leading-6 text-slate-500">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700" />
            <p>Local inference is available for supported models. Cloud processing depends on the provider and the settings you choose.</p>
          </div>
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500">
            This Website previews the workflow. Microphone, screen context and local inference run in VEYRA Desktop and require the relevant permissions.
          </p>
        </div>

        <div ref={visualRef} className="order-1 min-w-0 lg:order-2">
          <div className="relative mx-auto max-w-[720px] pb-5 sm:pb-8">
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-300/45 via-violet-200/30 to-sky-200/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/90 bg-white shadow-[0_32px_100px_-42px_rgba(37,33,91,0.45)] ring-1 ring-indigo-950/[0.07]">
              <div className="flex h-12 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-5">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500 sm:text-xs">
                  <Monitor className="h-3.5 w-3.5" />
                  Illustrative Desktop preview
                </div>
                <div className="hidden h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500 sm:flex">V</div>
              </div>

              <div className="grid min-h-[340px] sm:min-h-[385px] sm:grid-cols-[142px_minmax(0,1fr)]">
                <aside className="hidden border-r border-slate-200/80 bg-[#fafaff] p-3 sm:block">
                  <div className="mb-6 flex items-center gap-2 px-2 pt-1">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-700 text-white shadow-sm shadow-indigo-900/20"><Sparkles className="h-4 w-4" /></span>
                    <span className="text-sm font-bold tracking-tight text-slate-900">VEYRA</span>
                  </div>
                  <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
                  <nav aria-label="Illustrative desktop navigation" className="space-y-1">
                    {workspaceItems.map(({ label, icon: Icon, active }) => (
                      <div key={label} className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-medium ${active ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100' : 'text-slate-500'}`}>
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </div>
                    ))}
                  </nav>
                  <div className="mt-8 rounded-xl border border-indigo-100 bg-white p-3 shadow-sm shadow-indigo-950/[0.03]">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700"><Gauge className="h-3.5 w-3.5 text-indigo-600" /> Model setup</div>
                    <p className="mt-1.5 text-[9px] leading-4 text-slate-500">Choose a local model or a cloud provider in the app.</p>
                  </div>
                </aside>

                <div className="min-w-0 p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-medium text-slate-400">Practice / Session setup</p>
                      <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Build your next answer</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-medium text-slate-500 sm:text-[10px]">
                      <CircleCheck className="h-3.5 w-3.5 text-emerald-600" /> Practice mode
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_170px]">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/[0.025]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-indigo-700">SAMPLE QUESTION</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-500">Behavioral</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-900 sm:text-base">Tell me about a complex problem you worked through.</p>
                      <p className="mt-2 text-[10px] leading-4 text-slate-500">Practice shaping a clear answer from your own experience. This preview does not start a session.</p>
                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><MessageSquareText className="h-3.5 w-3.5" /></span>
                        <span className="text-[10px] font-medium text-slate-600">Answer structure guidance</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700"><BookOpenCheck className="h-3.5 w-3.5 text-indigo-600" /> Your context</div>
                        <p className="mt-2 text-[9px] leading-4 text-slate-500">Select the CV or profile details you want to use.</p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-500"><FileText className="h-3 w-3" /> Optional</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700"><AudioLines className="h-3.5 w-3.5 text-indigo-600" /> Voice check</div>
                        <p className="mt-2 text-[9px] leading-4 text-slate-500">Test your microphone before a practice session.</p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-500"><Mic2 className="h-3 w-3" /> Not started</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3.5 py-3">
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 sm:text-[10px]"><Waves className="h-3.5 w-3.5 text-indigo-600" /> Capture is off in this illustrative preview</div>
                    <span className="rounded-lg bg-indigo-700 px-3 py-2 text-[9px] font-semibold text-white shadow-sm">Ready when you are</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-3 rounded-2xl border border-white/80 bg-slate-950/[0.94] p-4 text-white shadow-[0_22px_60px_-30px_rgba(20,18,55,0.8)] ring-1 ring-slate-950/10 sm:absolute sm:-bottom-3 sm:right-5 sm:mt-0 sm:w-[270px] sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-violet-200"><Sparkles className="h-4 w-4" /></span>
                  <div><p className="text-[11px] font-semibold">Desktop copilot</p><p className="mt-0.5 text-[9px] text-slate-400">Illustrative overlay · idle</p></div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-slate-300">Capture off</span>
              </div>
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] p-3">
                <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-200" />
                <p className="text-[9px] leading-4 text-slate-300">Start listening only when you choose. Permission and session state stay visible.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  const capabilities = [
    { icon: Mic2, title: 'Interview preparation', description: 'Practice before the interview with AI-generated questions, answer feedback, and suggestions tailored to your target role.' },
    { icon: Sparkles, title: 'Live desktop copilot', description: 'Optional desktop guidance. Microphone and screen context require the relevant permissions and an explicit start.' },
    { icon: LockKeyhole, title: 'Privacy and control', description: 'Choose which context to use and whether processing stays local or uses a cloud provider.' },
    { icon: Monitor, title: 'Desktop context', description: 'Use VEYRA alongside the applications you choose. Available context depends on the permissions you enable.' },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">One workspace, two moments</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">Prepare with intention. Take support with you.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">Build confidence in practice, then choose whether to use optional Desktop guidance when the interview begins.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ icon: Icon, title, description }, index) => (
            <article key={title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_-22px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_22px_50px_-30px_rgba(49,46,129,0.3)]">
              <span className="text-xs font-semibold tabular-nums text-slate-300">0{index + 1}</span>
              <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function PracticeSection() {
  return (
    <section className="overflow-hidden bg-[#f6f7fc] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Practice, at your pace</p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">A calmer way to prepare for the hard questions.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">Build a practice session around your role, choose which candidate context to use, then work through questions and review your answers.</p>
          <div className="mt-7 space-y-3">
            {['Choose a role and interview style', 'Practice with typed or voice responses', 'Review suggestions grounded in your context'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-700"><CircleCheck className="h-4 w-4 text-emerald-600" />{item}</div>
            ))}
          </div>
          <Link href="/download" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Explore VEYRA Desktop <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-200/60 via-violet-100/60 to-sky-100/70 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_30px_70px_-44px_rgba(31,35,80,0.45)] sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold text-slate-900">Practice session</p><p className="mt-1 text-[11px] text-slate-500">Illustrative example · no session is running</p></div><span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-700">Behavioral</span></div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-indigo-700">Example prompt</p>
            <h3 className="mt-2 max-w-xl text-xl font-semibold leading-8 tracking-tight text-slate-900">Tell me about a time you had to make a difficult trade-off.</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-800">Your answer</p><p className="mt-2 text-xs leading-5 text-slate-500">Speak or type your response. VEYRA can help you review its clarity and structure.</p></div><div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4"><p className="flex items-center gap-2 text-xs font-semibold text-indigo-900"><Sparkles className="h-3.5 w-3.5" />Reflection prompts</p><p className="mt-2 text-xs leading-5 text-slate-600">What options did you consider? What changed because of your decision?</p></div></div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500"><LockKeyhole className="h-3.5 w-3.5 text-indigo-600" />Candidate context is optional and selected by you.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiveCopilotSection() {
  return (
    <section className="border-y border-slate-200/80 bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Optional Desktop guidance</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">Useful context, close at hand. Always under your control.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">When you explicitly start a supported capture flow in VEYRA Desktop, a compact overlay can keep relevant guidance alongside your work. Pause or stop it whenever you choose.</p>
          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3"><Mic2 className="h-4 w-4 text-indigo-700" />Microphone and screen context start only with the required permission.</div>
            <div className="flex items-center gap-3"><LockKeyhole className="h-4 w-4 text-indigo-700" />Capture state remains visible; this Website preview does not record.</div>
            <div className="flex items-center gap-3"><BrainCircuit className="h-4 w-4 text-indigo-700" />Local and cloud processing choices are shown in Desktop.</div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 blur-xl opacity-15" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#111625] p-5 text-white shadow-[0_34px_90px_-42px_rgba(14,20,48,0.65)] sm:p-7">
            <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/15 text-violet-200"><Sparkles className="h-5 w-5" /></div><div><p className="text-sm font-semibold">VEYRA · Live copilot</p><p className="mt-1 text-[11px] text-slate-400">Illustrative overlay preview</p></div></div><span className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1.5 text-[10px] font-medium text-slate-300">Idle · capture off</span></div>
            <div className="mt-6 flex min-h-36 flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-indigo-400/[0.06] px-5 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/15 text-violet-200"><AudioLines className="h-6 w-6" /></div><p className="mt-3 text-sm font-semibold">Ready when you are</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">Start a session in Desktop to see live state and guidance. Nothing is captured in this preview.</p></div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"><div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2 w-2 rounded-full bg-slate-500" />Microphone off</div><div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2 w-2 rounded-full bg-slate-500" />Screen context off</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DesktopExplanationSection() {
  return (
    <section className="bg-[#f6f7fc] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_20px_60px_-42px_rgba(49,46,129,0.35)] sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Monitor className="h-5 w-5" /></div><div><h2 className="text-lg font-semibold tracking-tight text-slate-950">The copilot runs on your computer.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">This Website supports your VEYRA account, plan and downloads. Interview practice, local inference, voice and optional screen context belong to the Desktop application.</p></div></div>
          <Link href="/download"><Button className="shrink-0 rounded-xl px-5">Explore Desktop <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}