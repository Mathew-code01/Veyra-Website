import Link from 'next/link';
import {
  ArrowRight,
  Cloud,
  Copy,
  Cpu,
  KeyRound,
  LockKeyhole,
  Mic2,
  MicOff,
  Minus,
  Monitor,
  MoreHorizontal,
  Pause,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VeyraLogo } from '@/components/marketing/logo';

const PROCESSING_MODES = [
  {
    icon: Cloud,
    title: 'Cloud processing',
    description:
      'A VEYRA-hosted service may be available depending on your account, region, and the current release.',
  },
  {
    icon: KeyRound,
    title: 'Your provider',
    description:
      'Bring-your-own-key options depend on the providers supported by your Desktop version and configuration.',
  },
  {
    icon: Cpu,
    title: 'Local or hybrid',
    description:
      'Local model use depends on installed runtimes, compatible hardware, and available models.',
  },
];

export function HeroSection() {
  return (
    <section className="bg-white py-8 min-[700px]:py-[72px]">
      <div className="mx-auto max-w-[1440px] px-5 min-[700px]:px-16">
        <div className="mx-auto grid max-w-[1312px] items-center gap-8 min-[700px]:gap-14 min-[1100px]:grid-cols-[minmax(0,600px)_minmax(0,640px)]">
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D6CBFF] bg-[#F5F2FF] px-3.5 py-2 text-xs font-semibold text-[#5638C4]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
              Privacy-first desktop interview copilot
            </div>
            <h1 className="max-w-[600px] text-balance text-[32px] font-bold leading-10 text-[#0F1B3D] min-[700px]:text-[54px] min-[700px]:leading-[60px]">
              Walk into every interview prepared — and supported.
            </h1>
            <p className="mt-5 max-w-[560px] text-[15px] leading-[26px] text-[#3B4766] min-[700px]:text-[17px]">
              Prepare with the experience and role context you choose. VEYRA Desktop can provide
              optional guidance when you start a supported capture session.
            </p>

            <div className="mt-6 flex flex-col gap-3 min-[700px]:flex-row min-[700px]:items-center">
              <Link href="/download">
                <Button size="lg" className="h-11 w-full rounded-[10px] px-5 font-semibold min-[700px]:w-auto">
                  Download VEYRA <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="h-11 w-full rounded-[10px] px-5 font-semibold min-[700px]:w-auto">
                  See how it works <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 text-[13px] text-[#3B4766] min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:gap-x-5">
              {[
                { icon: Mic2, label: 'You control capture' },
                { icon: LockKeyhole, label: 'Evidence stays labelled' },
                { icon: Monitor, label: 'Setup is shown in Desktop' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-[560px] text-xs leading-5 text-[#6B7694]">
              Desktop capabilities, permissions, and processing options vary by release and
              configuration.
            </p>
          </div>

          <div
            role="img"
            aria-label="Illustrative VEYRA Live Copilot answer preview. Microphone and screen capture are off; sample content is not candidate data."
            className="relative mx-auto h-[420px] w-full max-w-[640px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,27,61,0.12)] min-[700px]:h-[430px]"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-white">
              <div className="absolute inset-x-0 top-0 h-10 bg-[#EEF0F4]" />
              <div className="absolute left-20 top-12 h-[26px] w-[calc(100%-160px)] rounded-full bg-[#F7F8FC]" />
              <div className="absolute left-[30px] right-[30px] top-[100px] h-[150px] rounded-xl bg-[#EDE9FB]" />
              {Array.from({ length: 6 }, (_, index) => (
                <span
                  key={index}
                  className="absolute left-[30px] h-[10px] rounded-full bg-[#DADDE8]"
                  style={{
                    top: 278 + index * 22,
                    width: `max(30px, calc(100% - ${60 + (index % 3) * 120}px))`,
                  }}
                />
              ))}
            </div>

            <div className="absolute right-5 top-6 flex w-[calc(100%-40px)] max-w-[360px] flex-col gap-2.5 rounded-[18px] border border-white/70 bg-white/80 p-3 text-[#0F1B3D] shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <MoreHorizontal aria-hidden="true" className="h-4 w-4 shrink-0 text-[#6B7694]" />
                <VeyraLogo size="sm" className="h-5 w-5 shrink-0" />
                <div className="min-w-0 leading-none">
                  <p className="text-xs font-semibold">VEYRA</p>
                  <p className="mt-1 text-[9px] text-[#6B7694]">Illustrative · capture off</p>
                </div>
                <span className="flex-1" />
                <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full border border-[#6B7694]/40 bg-white/70 px-[7px] py-[3px] text-[10px] font-semibold leading-4 text-[#3B4766]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6B7694]" />
                  Mic off
                </span>
                <span className="hidden shrink-0 items-center gap-[5px] rounded-full border border-[#6B7694]/40 bg-white/70 px-[7px] py-[3px] text-[10px] font-semibold leading-4 text-[#3B4766] min-[700px]:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6B7694]" />
                  Screen off
                </span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/80">
                  <Minus aria-hidden="true" className="h-3.5 w-3.5 text-[#3B4766]" />
                </span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/80">
                  <X aria-hidden="true" className="h-3.5 w-3.5 text-[#3B4766]" />
                </span>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-[#E4E7F0] bg-white/85 p-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-[10px] font-semibold tracking-[0.08em] text-[#6B7694]">SUGGESTED ANSWER</p>
                  <span className="flex-1" />
                  <span className="rounded-full bg-[#F5F2FF] px-2.5 py-[3px] text-[10px] font-semibold text-[#5638C4]">
                    AI suggestion
                  </span>
                </div>
                <p className="text-[11px] leading-4 text-[#0F1B3D] min-[700px]:text-[13px] min-[700px]:leading-[19px]">
                  Situation: two engineers disagreed on the release approach.
                </p>
                <p className="text-[11px] leading-4 text-[#0F1B3D] min-[700px]:text-[13px] min-[700px]:leading-[19px]">
                  Action: I facilitated a short working session and compared options with data.
                </p>
                <p className="text-[11px] leading-4 text-[#0F1B3D] min-[700px]:text-[13px] min-[700px]:leading-[19px]">
                  Result: we shipped on time and adopted a shared decision log.
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-[#E6F5EE] px-2.5 py-[3px] text-[10px] font-semibold text-[#1F8A5B]">
                    Confirmed by you
                  </span>
                  <span className="text-[10px] text-[#6B7694]">CV · Project Atlas</span>
                </div>
                <p className="border-t border-slate-100 pt-1.5 text-[9px] text-[#6B7694]">
                  Example content · not candidate data
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-lg border border-[#E4E7F0] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#3B4766]">Copy</span>
                <span className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-[#5638C4]">Follow-ups</span>
                <span className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-[#5638C4]">Retry</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#6B7694]">
                  <MicOff aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
                  <Monitor aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
                  <Pause aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
                  <Square aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
                <span className="flex h-[34px] min-w-0 flex-1 items-center rounded-full border border-[#E4E7F0] bg-white/85 px-3 text-xs text-[#6B7694]">
                  Ask…
                </span>
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
                  <Copy aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiveCopilotSection() {
  return (
    <section className="bg-white py-10 min-[700px]:py-[72px]">
      <div className="mx-auto grid max-w-[1312px] items-center gap-8 px-5 min-[700px]:gap-12 min-[700px]:px-16 min-[1100px]:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5638C4]">Live Copilot</p>
          <h2 className="mt-3 max-w-xl text-[28px] font-bold leading-9 tracking-tight text-[#0F1B3D] min-[700px]:text-[36px] min-[700px]:leading-[44px]">
            A light overlay that stays out of the way.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#3B4766]">
            Keep the session state visible and open more detail when you need it. The intended
            Desktop experience distinguishes your confirmed context from AI-generated suggestions.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[#3B4766]">
            {[
              'Capture status is visible while a session is active.',
              'Pause or stop controls belong to the Desktop session.',
              'A manual question path is available when capture is not used.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6B4FE0]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-5 text-[#6B7694]">
            The preview is static; it does not activate a microphone, capture a screen, or generate
            a response.
          </p>
        </div>

        <div
          role="img"
          aria-label="Illustrative Desktop overlay over a dark editor, with capture off and sample follow-up prompts."
          className="relative mx-auto h-[360px] w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#25283A] bg-[#1E2030] p-5 shadow-[0_12px_36px_rgba(15,27,61,0.14)] min-[700px]:h-[400px] min-[700px]:p-7"
        >
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-12 border-r border-white/5 bg-[#181A27] min-[700px]:w-14" />
          <div aria-hidden="true" className="absolute inset-y-0 left-12 hidden w-44 border-r border-white/5 bg-[#1B1D2B] p-4 min-[700px]:block">
            <div className="h-2 w-20 rounded-full bg-slate-600/70" />
            <div className="mt-6 space-y-3">
              {['w-24', 'w-32', 'w-20', 'w-28', 'w-16'].map((width, index) => (
                <div key={index} className={`h-1.5 rounded-full bg-slate-500/40 ${width}`} />
              ))}
            </div>
          </div>
          <div aria-hidden="true" className="absolute left-[76px] top-12 hidden space-y-5 min-[700px]:block">
            {['w-56', 'w-72', 'w-48', 'w-64', 'w-40', 'w-56'].map((width, index) => (
              <div key={index} className={`h-2 rounded-full ${index % 2 ? 'bg-[#7AA2F7]/60' : 'bg-slate-500/50'} ${width}`} />
            ))}
          </div>

          <div className="relative ml-auto w-full max-w-[370px] rounded-[18px] border border-white/70 bg-white/95 p-3 text-[#0F1B3D] shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-md min-[700px]:p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F2FF] text-[#5638C4]">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold">VEYRA · Live Copilot</p>
                <p className="text-[9px] text-[#6B7694]">Illustrative preview · capture off</p>
              </div>
              <span className="ml-auto rounded-full border border-[#E4E7F0] bg-[#F7F8FC] px-2 py-1 text-[9px] text-[#3B4766]">Mic off</span>
            </div>
            <div className="mt-3 rounded-xl bg-[#F5F2FF] p-3">
              <p className="text-[9px] font-semibold tracking-wide text-[#5638C4]">SAMPLE QUESTION</p>
              <p className="mt-1 text-[11px] font-semibold leading-4">How did you decide which approach to take?</p>
            </div>
            <div className="mt-3 rounded-xl border border-[#E4E7F0] bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-semibold tracking-wide text-[#6B7694]">POSSIBLE FOLLOW-UPS</p>
                <span className="text-[9px] text-[#6B7694]">Examples</span>
              </div>
              <div className="mt-2 space-y-2">
                {['What trade-offs did you consider?', 'How did you measure the result?'].map((prompt) => (
                  <p key={prompt} className="rounded-lg border border-[#E4E7F0] px-2.5 py-2 text-[10px] text-[#3B4766]">{prompt}</p>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[9px] text-[#6B7694]">
              <span className="inline-flex items-center gap-1.5"><Mic2 aria-hidden="true" className="h-3 w-3" />Microphone off</span>
              <span className="inline-flex items-center gap-1.5"><Monitor aria-hidden="true" className="h-3 w-3" />Screen off</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GroundedEvidenceSection() {
  return (
    <section className="bg-[#F5F2FF] py-10 min-[700px]:py-[72px]">
      <div className="mx-auto grid max-w-[1312px] items-center gap-8 px-5 min-[700px]:gap-12 min-[700px]:px-16 min-[1100px]:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid gap-3 min-[700px]:grid-cols-2">
          <article className="rounded-xl border border-emerald-700/40 bg-white p-4 shadow-[0_8px_24px_rgba(15,27,61,0.05)]">
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">CONFIRMED BY YOU</span>
            <h3 className="mt-3 text-sm font-semibold text-[#0F1B3D]">Candidate-provided context</h3>
            <p className="mt-2 text-xs leading-5 text-[#3B4766]">
              A detail you have reviewed and chosen to include in your profile.
            </p>
            <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-[#6B7694]">Example label · no profile data shown</p>
          </article>
          <article className="rounded-xl border border-dashed border-[#8A74E8] bg-white/80 p-4 shadow-[0_8px_24px_rgba(15,27,61,0.04)] min-[700px]:mt-8">
            <span className="inline-flex rounded-full bg-[#F5F2FF] px-2.5 py-1 text-[10px] font-semibold text-[#5638C4]">AI SUGGESTION · UNVERIFIED</span>
            <h3 className="mt-3 text-sm font-semibold text-[#0F1B3D]">A prompt to review</h3>
            <p className="mt-2 text-xs leading-5 text-[#3B4766]">
              A suggestion can help you reflect, but it is not evidence until you confirm it.
            </p>
            <p className="mt-3 border-t border-[#EAE4FF] pt-2 text-[10px] text-[#6B7694]">Example label · not candidate data</p>
          </article>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5638C4]">Evidence, clearly labelled</p>
          <h2 className="mt-3 text-[28px] font-bold leading-9 tracking-tight text-[#0F1B3D] min-[700px]:text-[36px] min-[700px]:leading-[44px]">
            Keep what you confirmed separate from what AI suggested.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#3B4766]">
            VEYRA is designed to distinguish candidate-provided context from generated suggestions,
            so an unverified idea is not presented as your experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProcessingModesSection() {
  return (
    <section className="bg-white py-10 min-[700px]:py-[72px]">
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-16">
        <div className="mx-auto mb-8 max-w-2xl text-center min-[700px]:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5638C4]">Processing options</p>
          <h2 className="mt-3 text-[26px] font-bold leading-9 text-[#0F1B3D] min-[700px]:text-[32px]">
            Choose from the options available to your setup.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6B7694]">
            Availability depends on your account, the current release, supported providers, and
            your device. VEYRA Desktop shows the options configured for you.
          </p>
        </div>
        <div className="grid gap-4 min-[900px]:grid-cols-3">
          {PROCESSING_MODES.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border border-[#E4E7F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,27,61,0.05)] min-[700px]:p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAE4FF] text-[#5638C4]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#0F1B3D]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#3B4766]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
