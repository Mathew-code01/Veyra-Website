import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Circle,
  Copy,
  FileText,
  Mic,
  Minus,
  Monitor,
  MoreHorizontal,
  Pause,
  ShieldCheck,
  Sparkles,
  Square,
  Video,
  X,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { VeyraLogo } from '@/components/marketing/logo';

export const metadata: Metadata = {
  title: 'Live Copilot | VEYRA',
  description:
    'Explore the VEYRA Live Copilot interface, its visible capture states, and user-controlled session controls.',
};

type PreviewState = 'idle' | 'listening' | 'question' | 'answer';

const STATE_PREVIEWS: {
  state: PreviewState;
  title: string;
  detail: string;
}[] = [
  {
    state: 'idle',
    title: 'Idle — nothing captured',
    detail: 'Microphone and screen are off until you start a supported session.',
  },
  {
    state: 'listening',
    title: 'Listening — mic on',
    detail: 'The active microphone state remains visible while listening.',
  },
  {
    state: 'question',
    title: 'Question detected',
    detail: 'A detected question is shown before a suggested answer.',
  },
  {
    state: 'answer',
    title: 'Answer with evidence',
    detail: 'Suggestions stay distinct from candidate-confirmed context.',
  },
];

const SESSION_CONTROLS = [
  {
    control: 'Start / Stop',
    action: 'Begin or end capture in a supported Desktop session.',
    state: 'Capture starts only after you choose Start.',
  },
  {
    control: 'Pause / Resume',
    action: 'Temporarily stop or resume active capture where supported.',
    state: 'The paused state is shown in the overlay.',
  },
  {
    control: 'Microphone',
    action: 'Enable or disable microphone capture after permission is granted.',
    state: 'Microphone state remains visible.',
  },
  {
    control: 'Screen capture',
    action: 'Choose a supported window or display in Desktop.',
    state: 'Screen capture stays off until enabled.',
  },
  {
    control: 'Manual question',
    action: 'Type a question instead of using microphone or screen capture.',
    state: 'Text-only input; no capture required.',
  },
];

function CaptureStatus({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold leading-none ${
        active
          ? 'border-[#1F8A5B]/25 bg-[#E6F5EE] text-[#1F8A5B]'
          : 'border-[#E4E7F0] bg-white/85 text-[#6B7694]'
      }`}
    >
      <Circle aria-hidden="true" className={`h-1.5 w-1.5 fill-current ${active ? '' : 'opacity-70'}`} />
      {label}
    </span>
  );
}

function ExampleAnswer() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#E4E7F0] bg-white/90 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-[#6B7694]">
          SUGGESTED ANSWER
        </p>
        <span className="rounded-full bg-[#F5F2FF] px-2.5 py-1 text-[10px] font-semibold text-[#5638C4]">
          AI suggestion
        </span>
      </div>
      <p className="text-xs leading-[18px] text-[#0F1B3D]">
        Situation: two engineers disagreed on the release approach.
      </p>
      <p className="text-xs leading-[18px] text-[#0F1B3D]">
        Action: I facilitated a short working session and compared options with data.
      </p>
      <p className="text-xs leading-[18px] text-[#0F1B3D]">
        Result: we shipped on time and adopted a shared decision log.
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-[#E6F5EE] px-2 py-1 text-[10px] font-semibold text-[#1F8A5B]">
          Confirmed by you
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-[#6B7694]">
          <FileText aria-hidden="true" className="h-3 w-3" />
          CV · Project Atlas
        </span>
      </div>
      <p className="border-t border-[#E4E7F0] pt-1.5 text-[10px] text-[#6B7694]">
        Example content · not candidate data
      </p>
    </div>
  );
}

function OverlayPreview({
  state,
  dense = false,
}: {
  state: PreviewState;
  dense?: boolean;
}) {
  const isListening = state === 'listening' || state === 'question' || state === 'answer';

  return (
    <div
      role="img"
      aria-label={`Illustrative Live Copilot ${state} state. This preview does not capture audio or screen content.`}
      className={`w-full rounded-[18px] border border-white/80 bg-white/90 p-3 text-[#0F1B3D] shadow-[0_12px_40px_rgba(15,27,61,0.18)] backdrop-blur-md ${
        dense ? 'max-w-[300px]' : 'max-w-[360px]'
      }`}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <MoreHorizontal aria-hidden="true" className="h-4 w-4 shrink-0 text-[#6B7694]" />
        <VeyraLogo size="sm" className="h-5 w-5 shrink-0" />
        <div className="min-w-0 leading-none">
          <p className="text-xs font-semibold">VEYRA</p>
          <p className="mt-1 text-[9px] text-[#6B7694]">Illustrative state</p>
        </div>
        <span className="flex-1" />
        <CaptureStatus label={`Mic ${isListening ? 'on' : 'off'}`} active={isListening} />
        {!dense && <CaptureStatus label="Screen off" />}
        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/80">
          <Minus className="h-3.5 w-3.5 text-[#3B4766]" />
        </span>
        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/80">
          <X className="h-3.5 w-3.5 text-[#3B4766]" />
        </span>
      </div>

      <div className="mt-2.5">
        {state === 'idle' && (
          <div className="rounded-xl border border-[#E4E7F0] bg-white/85 p-3">
            <p className="text-sm font-semibold">Ready when you are</p>
            <p className="mt-1 text-xs leading-5 text-[#3B4766]">
              Nothing is being captured. Start a supported session or enter a question manually.
            </p>
          </div>
        )}

        {state === 'listening' && (
          <div className="rounded-xl border border-[#E4E7F0] bg-white/85 p-3">
            <div aria-hidden="true" className="flex h-9 items-center gap-1">
              {[10, 20, 28, 16, 24, 32, 18, 26, 12, 21, 30, 14].map((height, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-[#6B4FE0]"
                  style={{ height }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-[#3B4766]">Listening… capture is on.</p>
          </div>
        )}

        {state === 'question' && (
          <div className="rounded-xl border border-[#D6CBFF] bg-[#F5F2FF] p-3">
            <p className="text-[10px] font-semibold tracking-[0.08em] text-[#5638C4]">
              QUESTION DETECTED
            </p>
            <p className="mt-2 text-sm font-semibold leading-5">
              Tell me about a time you resolved a conflict within a team.
            </p>
          </div>
        )}

        {state === 'answer' && <ExampleAnswer />}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
        {state === 'answer' ? (
          <>
            <span className="rounded-lg border border-[#E4E7F0] bg-white px-2.5 py-1.5 text-[#3B4766]">Copy</span>
            <span className="rounded-lg px-2.5 py-1.5 text-[#5638C4]">Follow-ups</span>
            <span className="rounded-lg px-2.5 py-1.5 text-[#5638C4]">Retry</span>
          </>
        ) : (
          <span className="rounded-lg border border-[#E4E7F0] bg-white px-2.5 py-1.5 text-[#3B4766]">
            {state === 'idle' ? 'Ask manually' : 'Question preview'}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <span aria-hidden="true" className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#6B7694]">
          <Mic aria-hidden="true" className="h-4 w-4" />
        </span>
        <span aria-hidden="true" className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
          <Monitor aria-hidden="true" className="h-4 w-4" />
        </span>
        <span aria-hidden="true" className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
          <Pause aria-hidden="true" className="h-4 w-4" />
        </span>
        <span aria-hidden="true" className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
          <Square aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
        <span className="flex h-[34px] min-w-0 flex-1 items-center rounded-full border border-[#E4E7F0] bg-white/85 px-3 text-xs font-normal text-[#6B7694]">
          Ask…
        </span>
        <span aria-hidden="true" className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-[#E4E7F0] bg-white/85 text-[#3B4766]">
          <Copy aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function VideoCallBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#14161F] p-4">
      <div className="grid h-full grid-cols-2 gap-3 pb-10">
        {[
          'bg-[#2A2E3F]',
          'bg-[#323750]',
          'bg-[#262A3A]',
          'bg-[#2E3347]',
        ].map((color, index) => (
          <div key={index} className={`grid place-items-center rounded-xl ${color}`}>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#4B5170] text-sm font-semibold text-white/80">
              {String.fromCharCode(65 + index)}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center gap-3 bg-[#0E1017]">
        {[1, 2, 3, 4, 5].map((item) => (
          <span key={item} className={`h-7 w-7 rounded-full ${item === 5 ? 'bg-[#C23B3B]' : 'bg-[#3A3F58]'}`} />
        ))}
      </div>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[660px] overflow-hidden rounded-2xl border border-[#E4E7F0] bg-[#14161F] shadow-[0_8px_24px_rgba(15,27,61,0.12)] min-[700px]:h-[440px]">
      <VideoCallBackdrop />
      <div className="absolute inset-0 flex items-start justify-end p-3 min-[700px]:p-5">
        <OverlayPreview state="answer" dense />
      </div>
      <div className="absolute bottom-3 left-3 z-10 rounded-full border border-white/20 bg-[#0E1017]/90 px-3 py-1.5 text-[10px] font-medium text-white/80">
        Illustrative interface · no capture active
      </div>
    </div>
  );
}

function StateCard({ state, title, detail }: (typeof STATE_PREVIEWS)[number]) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-[#E4E7F0] bg-white p-3 shadow-[0_2px_8px_rgba(15,27,61,0.04)]">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B7694]">
        Illustrative state
      </p>
      <div className="flex min-h-[255px] flex-1 items-start justify-center rounded-xl bg-[#F7F8FC] p-2">
        <OverlayPreview state={state} dense />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-[#0F1B3D]">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-[#6B7694]">{detail}</p>
    </article>
  );
}

type AppContext = 'browser' | 'editor' | 'video' | 'design';

const APP_CONTEXTS: { context: AppContext; label: string; icon: typeof Video }[] = [
  { context: 'browser', label: 'Browser', icon: FileText },
  { context: 'editor', label: 'Code editor', icon: Sparkles },
  { context: 'video', label: 'Video call', icon: Video },
  { context: 'design', label: 'Design app', icon: ShieldCheck },
];

function ApplicationPreview({ context, label, icon: Icon }: (typeof APP_CONTEXTS)[number]) {
  const isDark = context === 'editor' || context === 'video';

  return (
    <article className="min-w-0">
      <div
        role="img"
        aria-label={`Illustrative minimized Live Copilot overlay over a ${label.toLowerCase()}. No content is being captured.`}
        className={`relative h-[200px] overflow-hidden rounded-xl border border-[#E4E7F0] ${
          isDark ? 'bg-[#1E2030]' : 'bg-white'
        }`}
      >
        {context === 'browser' && (
          <div aria-hidden="true" className="absolute inset-0 p-4">
            <div className="h-5 rounded-full bg-[#EEF0F4]" />
            <div className="mt-4 h-10 w-2/3 rounded-lg bg-[#EDE9FB]" />
            <div className="mt-3 space-y-2">
              <span className="block h-2 w-full rounded-full bg-[#DADDE8]" />
              <span className="block h-2 w-4/5 rounded-full bg-[#DADDE8]" />
              <span className="block h-2 w-3/5 rounded-full bg-[#DADDE8]" />
            </div>
          </div>
        )}
        {context === 'editor' && (
          <div aria-hidden="true" className="absolute inset-0 space-y-3 p-5">
            {[['w-1/2', 'bg-[#7AA2F7]'], ['w-2/3', 'bg-[#BB9AF7]'], ['w-1/3', 'bg-[#9ECE6A]'], ['w-3/4', 'bg-[#E0AF68]'], ['w-1/2', 'bg-[#7AA2F7]']].map(([width, color], index) => (
              <span key={index} className={`block h-2 rounded-full opacity-75 ${width} ${color}`} />
            ))}
          </div>
        )}
        {context === 'video' && (
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 gap-2 p-3">
            {['bg-[#2A2E3F]', 'bg-[#323750]', 'bg-[#262A3A]', 'bg-[#2E3347]'].map((color) => (
              <span key={color} className={`rounded-lg ${color}`} />
            ))}
          </div>
        )}
        {context === 'design' && (
          <div aria-hidden="true" className="absolute inset-0 bg-[#E6E7EC] p-4">
            <div className="absolute left-4 top-4 h-[168px] w-8 rounded bg-white" />
            <div className="absolute right-4 top-4 h-[168px] w-12 rounded bg-white" />
            <div className="absolute left-16 top-6 h-[130px] w-[46%] rounded-lg border border-[#E4E7F0] bg-white">
              <span className="absolute left-5 top-6 h-12 w-12 rounded-xl bg-[#C9B8FF]" />
              <span className="absolute bottom-5 right-5 h-10 w-10 rounded-full bg-[#FFB4A2]" />
            </div>
          </div>
        )}

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-2.5 py-2 text-[#0F1B3D] shadow-[0_6px_18px_rgba(15,27,61,0.18)] backdrop-blur-sm">
          <VeyraLogo size="sm" className="h-4 w-4" />
          <span className="text-[10px] font-semibold">VEYRA Copilot</span>
          <CaptureStatus label="Mic off" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#3B4766]">
        <Icon aria-hidden="true" className="h-4 w-4 text-[#6B4FE0]" />
        {label}
      </div>
    </article>
  );
}

function ControlTable() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#E4E7F0] bg-white md:block">
        <table className="w-full table-fixed text-left">
          <thead className="bg-[#F7F8FC] text-xs font-semibold text-[#6B7694]">
            <tr>
              <th className="w-[180px] px-4 py-3">Control</th>
              <th className="px-4 py-3">What it does</th>
              <th className="w-[290px] px-4 py-3">Visible state</th>
            </tr>
          </thead>
          <tbody>
            {SESSION_CONTROLS.map((item) => (
              <tr key={item.control} className="border-t border-[#E4E7F0] align-top">
                <th scope="row" className="px-4 py-4 text-sm font-semibold text-[#0F1B3D]">
                  {item.control}
                </th>
                <td className="px-4 py-4 text-sm leading-6 text-[#3B4766]">{item.action}</td>
                <td className="px-4 py-4 text-sm leading-6 text-[#3B4766]">{item.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {SESSION_CONTROLS.map((item) => (
          <article key={item.control} className="rounded-xl border border-[#E4E7F0] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#0F1B3D]">{item.control}</h3>
            <p className="mt-2 text-sm leading-6 text-[#3B4766]">{item.action}</p>
            <p className="mt-2 text-xs leading-5 text-[#6B7694]">{item.state}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export default function LiveCopilotPage() {
  return (
    <div className="min-h-screen bg-white text-[#0F1B3D]">
      <Header />
      <main>
        <section aria-labelledby="live-copilot-title" className="bg-white py-12 min-[700px]:py-16">
          <div className="mx-auto grid max-w-[1312px] items-center gap-10 px-5 min-[700px]:gap-14 min-[700px]:px-16 min-[1100px]:grid-cols-[560px_minmax(0,660px)]">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B4FE0]">
                Live Interview Copilot
              </p>
              <h1
                id="live-copilot-title"
                className="mt-3 max-w-[560px] text-[32px] font-bold leading-10 tracking-tight text-[#0F1B3D] min-[700px]:text-[36px] min-[700px]:leading-[44px]"
              >
                Help that appears when you ask for it.
              </h1>
              <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[#3B4766] min-[700px]:text-[17px] min-[700px]:leading-[27px]">
                In supported Desktop sessions, press Start to begin capture. VEYRA can detect the
                question, retrieve confirmed evidence and draft a concise answer.
              </p>
              <div className="mt-6 flex flex-col gap-3 min-[700px]:flex-row min-[700px]:items-center">
                <Button asChild size="lg" className="w-full min-[700px]:w-auto">
                  <Link href="/download">
                    Download VEYRA <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full min-[700px]:w-auto">
                  <Link href="/privacy">Privacy controls</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E7F0] bg-white px-3 py-2 text-xs font-medium text-[#3B4766]">
                  <Mic aria-hidden="true" className="h-4 w-4 text-[#6B4FE0]" />
                  Capture starts by choice
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E7F0] bg-white px-3 py-2 text-xs font-medium text-[#3B4766]">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#6B4FE0]" />
                  Evidence stays labelled
                </span>
              </div>
            </div>

            <HeroPreview />
          </div>
        </section>

        <section aria-labelledby="state-examples-title" className="bg-[#F7F8FC] py-12 min-[700px]:py-14">
          <div className="mx-auto max-w-[1312px] px-5 min-[700px]:px-16">
            <div className="mx-auto max-w-[900px] text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B4FE0]">
                States
              </p>
              <h2
                id="state-examples-title"
                className="mt-3 text-[26px] font-bold leading-9 tracking-tight text-[#0F1B3D] min-[700px]:text-[36px] min-[700px]:leading-[44px]"
              >
                Every moment has a clear state.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#3B4766]">
                These examples show how the overlay can change through a supported session. They
                are static previews, not an active capture session.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4 min-[1100px]:gap-5">
              {STATE_PREVIEWS.map((item) => (
                <StateCard key={item.state} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="controls-title" className="bg-white py-12 min-[700px]:py-14">
          <div className="mx-auto max-w-[1312px] px-5 min-[700px]:px-16">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B4FE0]">
                Controls
              </p>
              <h2
                id="controls-title"
                className="mt-3 text-[26px] font-bold leading-9 tracking-tight text-[#0F1B3D] min-[700px]:text-[36px] min-[700px]:leading-[44px]"
              >
                You are always in control.
              </h2>
            </div>
            <ControlTable />
          </div>
        </section>

        <section aria-labelledby="app-contexts-title" className="bg-[#F5F2FF] py-12 min-[700px]:py-14">
          <div className="mx-auto max-w-[1312px] px-5 min-[700px]:px-16">
            <div className="mx-auto max-w-[900px] text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B4FE0]">
                Works over your apps
              </p>
              <h2
                id="app-contexts-title"
                className="mt-3 text-[26px] font-bold leading-9 tracking-tight text-[#0F1B3D] min-[700px]:text-[36px] min-[700px]:leading-[44px]"
              >
                Readable on light, dark, video and design tools.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#3B4766]">
                Illustrative backdrops show the intended contrast; they do not capture or inspect
                the apps behind them.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
              {APP_CONTEXTS.map((item) => (
                <ApplicationPreview key={item.context} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 min-[700px]:py-14">
          <div className="mx-auto flex max-w-[1312px] flex-col items-center gap-4 bg-[#F5F2FF] px-5 py-12 text-center min-[700px]:rounded-2xl min-[700px]:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5638C4]">
              Start when you are ready
            </p>
            <h2 className="max-w-2xl text-[26px] font-bold leading-9 tracking-tight text-[#0F1B3D] min-[700px]:text-[34px] min-[700px]:leading-[42px]">
              See how VEYRA fits your interview setup.
            </h2>
            <p className="max-w-xl text-sm leading-6 text-[#3B4766]">
              Desktop availability, capture permissions and processing options vary by release and
              configuration.
            </p>
            <div className="mt-2 flex w-full flex-col justify-center gap-3 min-[700px]:w-auto min-[700px]:flex-row">
              <Button asChild size="lg" className="w-full min-[700px]:w-auto">
                <Link href="/download">
                  Download VEYRA <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full min-[700px]:w-auto">
                <Link href="/contact">Talk to support</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
