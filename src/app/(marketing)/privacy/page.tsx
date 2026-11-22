import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Circle,
  FileText,
  Mic,
  Monitor,
  Shield,
  UserCheck,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Privacy Policy | VEYRA',
  description:
    'Learn how VEYRA handles capture controls, account information, documents, and authentication.',
};

const privacyRows = [
  {
    data: 'Microphone audio',
    use: 'Only in a supported session after you enable microphone access.',
    handling: 'Depends on the selected processing mode.',
    control: 'Pause or stop from Desktop.',
  },
  {
    data: 'Screen content',
    use: 'Limited to a selected window or display in supported sessions.',
    handling: 'Depends on the selected processing mode.',
    control: 'Off until enabled.',
  },
  {
    data: 'CVs and documents',
    use: 'May be used as answer context when you authorize access.',
    handling: 'Storage and processing vary by configuration.',
    control: 'Review and manage in Desktop where available.',
  },
  {
    data: 'Provider API keys',
    use: 'Used with supported providers you configure.',
    handling: 'Review the current details in Desktop provider settings.',
    control: 'Provider usage follows your provider account and terms.',
  },
  {
    data: 'Account and billing',
    use: 'Sign-in, entitlements, subscriptions, devices, and usage.',
    handling: 'Managed by the VEYRA Platform.',
    control: 'Manage from your account pages.',
  },
];

const captureStates = [
  { label: 'Mic on', style: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { label: 'Screen off', style: 'border-border bg-white text-muted-foreground' },
  { label: 'Paused', style: 'border-amber-200 bg-amber-50 text-amber-800' },
  { label: 'Blocked by system', style: 'border-red-200 bg-red-50 text-red-700' },
];

function CaptureStates() {
  return (
    <div className="mt-7 flex flex-wrap gap-3" aria-label="Illustrative capture states">
      <p className="w-full text-xs font-medium text-muted-foreground">
        Illustrative states — not an active session
      </p>
      {captureStates.map(({ label, style }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium ${style}`}
        >
          <Circle aria-hidden="true" className="h-2 w-2 fill-current" />
          {label}
        </span>
      ))}
      <span className="sr-only">These are examples, not a live capture status.</span>
    </div>
  );
}

function DataHandlingTable() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-white lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed text-left">
            <thead className="bg-secondary/60 text-xs font-semibold text-muted-foreground">
              <tr>
                <th scope="col" className="w-[170px] px-4 py-3">Data</th>
                <th scope="col" className="px-4 py-3">When it is used</th>
                <th scope="col" className="w-[250px] px-4 py-3">Handling</th>
                <th scope="col" className="w-[220px] px-4 py-3">Your control</th>
              </tr>
            </thead>
            <tbody>
              {privacyRows.map((row) => (
                <tr key={row.data} className="border-t border-border align-top">
                  <th scope="row" className="px-4 py-4 text-sm font-semibold text-veyra-navy">
                    {row.data}
                  </th>
                  <td className="px-4 py-4 text-sm leading-6 text-muted-foreground">{row.use}</td>
                  <td className="px-4 py-4 text-sm leading-6 text-muted-foreground">{row.handling}</td>
                  <td className="px-4 py-4 text-sm leading-6 text-muted-foreground">{row.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {privacyRows.map((row) => (
          <article key={row.data} className="rounded-xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-veyra-navy">{row.data}</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-foreground">When it is used</dt>
                <dd className="mt-1 leading-6 text-muted-foreground">{row.use}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Handling</dt>
                <dd className="mt-1 leading-6 text-muted-foreground">{row.handling}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Your control</dt>
                <dd className="mt-1 leading-6 text-muted-foreground">{row.control}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}

const policySections = [
  {
    icon: Shield,
    title: 'Documents and recordings',
    body:
      'CVs, interview recordings, and private documents are not stored centrally by default. Backup is opt-in with explicit consent and user-controlled retention.',
  },
  {
    icon: FileText,
    title: 'Account data',
    body:
      'Your email, profile, subscription, credits, devices, and usage are managed by the VEYRA Platform. You can request account deletion and data export from your account settings.',
  },
  {
    icon: UserCheck,
    title: 'Authentication',
    body:
      'Sign-in is handled through Supabase Auth (email/password or OAuth). Session tokens are managed in secure cookies and never stored in localStorage.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section aria-labelledby="privacy-title" className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
                Privacy and security
              </p>
              <h1
                id="privacy-title"
                className="mt-3 text-3xl font-bold leading-tight tracking-tight text-veyra-navy md:text-4xl"
              >
                Capture is never silent.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                In supported Desktop sessions, VEYRA shows when microphone or screen capture is
                active. You can pause or stop capture; available controls depend on your release
                and configuration.
              </p>
              <CaptureStates />
            </div>
          </div>
        </section>

        <section aria-labelledby="data-handling-title" className="bg-secondary/40 py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
                At a glance
              </p>
              <h2
                id="data-handling-title"
                className="mt-3 text-2xl font-bold tracking-tight text-veyra-navy md:text-3xl"
              >
                Data handling and your controls
              </h2>
            </div>
            <DataHandlingTable />
          </div>
        </section>

        <section aria-label="Policy details" className="bg-white py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <Shield aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                This is a product summary; final legal wording requires review. VEYRA makes no
                security certification, independent audit, or regulatory compliance claims here.
                Data handling can vary by operating mode and configuration.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {policySections.map(({ icon: Icon, title, body }) => (
                <article key={title} className="rounded-xl border border-border bg-card p-6">
                  <Icon aria-hidden="true" className="h-5 w-5 text-veyra-indigo" />
                  <h2 className="mt-4 text-lg font-semibold text-veyra-navy">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/live-copilot">
                  Explore Live Copilot controls
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
