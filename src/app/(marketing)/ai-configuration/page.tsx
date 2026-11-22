import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  CircleAlert,
  Cpu,
  Globe2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Configuration | VEYRA',
  description:
    'Compare VEYRA Cloud, bring-your-own-provider, and local or hybrid modes.',
};

type OperatingMode = {
  title: string;
  summary: string;
  bestFor: string;
  icon: LucideIcon;
  points: string[];
  limits: string[];
  featured?: boolean;
};

const operatingModes: OperatingMode[] = [
  {
    title: 'Cloud-only',
    summary: 'Use VEYRA-hosted models when an eligible offer is available.',
    bestFor: 'Best for a simpler setup',
    icon: Globe2,
    featured: true,
    points: [
      'Requires an internet connection.',
      'Subscription and usage allowances come from the Platform.',
      'No local model installation is required.',
    ],
    limits: [
      'Availability, pricing, and included usage depend on published Platform offers.',
      'Model capabilities can vary by release.',
    ],
  },
  {
    title: 'Bring your own provider',
    summary: 'Connect a supported provider from VEYRA Desktop.',
    bestFor: 'Best for your existing provider account',
    icon: KeyRound,
    points: [
      'Choose a supported provider for the capabilities you need.',
      'Provider usage follows your provider account and terms.',
      'Provider support varies by model and capability.',
    ],
    limits: [
      'You manage provider limits and billing.',
      'Check current credential handling in Desktop settings.',
    ],
  },
  {
    title: 'Local or hybrid',
    summary: 'Use compatible local models, with optional configured fallback.',
    bestFor: 'Best for device-based or offline use',
    icon: Cpu,
    points: [
      'Model compatibility depends on your device and configuration.',
      'Hardware checks should guide model selection.',
      'Offline use depends on installed models and supported features.',
    ],
    limits: [
      'Large model downloads may be required.',
      'Performance depends on the device and selected model.',
    ],
  },
];

const capabilityRows = [
  { capability: 'Text and reasoning', cloud: 'Plan dependent', byok: 'Provider dependent', local: 'Model dependent' },
  { capability: 'Vision and screen understanding', cloud: 'Verify in Desktop', byok: 'Verify in Desktop', local: 'Verify in Desktop' },
  { capability: 'Audio transcription', cloud: 'Verify in Desktop', byok: 'Verify in Desktop', local: 'Verify in Desktop' },
  { capability: 'Text-to-speech', cloud: 'Verify in Desktop', byok: 'Verify in Desktop', local: 'Verify in Desktop' },
];

function ModeCard({ mode }: { mode: OperatingMode }) {
  const Icon = mode.icon;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 sm:p-6 ${
        mode.featured
          ? 'border-2 border-veyra-indigo shadow-[0_8px_24px_rgba(15,27,61,0.08)]'
          : 'border-border'
      }`}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-veyra-indigo/10 text-veyra-indigo">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-xl font-bold text-veyra-navy">{mode.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{mode.summary}</p>
      <p className="mt-4 text-xs font-semibold text-veyra-indigo">{mode.bestFor}</p>

      <ul className="mt-5 space-y-3">
        {mode.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm leading-5 text-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-veyra-indigo" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Limitations
        </p>
        <ul className="mt-3 space-y-2.5">
          {mode.limits.map((limit) => (
            <li key={limit} className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
              <CircleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CapabilityTable() {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-white lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] table-fixed text-left">
            <thead className="bg-secondary/60 text-xs font-semibold text-muted-foreground">
              <tr>
                <th scope="col" className="w-[260px] px-4 py-3">Capability</th>
                <th scope="col" className="px-4 py-3">Cloud-only</th>
                <th scope="col" className="px-4 py-3">Bring your own provider</th>
                <th scope="col" className="px-4 py-3">Local / hybrid</th>
              </tr>
            </thead>
            <tbody>
              {capabilityRows.map((row) => (
                <tr key={row.capability} className="border-t border-border">
                  <th scope="row" className="px-4 py-4 text-sm font-semibold text-veyra-navy">
                    {row.capability}
                  </th>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{row.cloud}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{row.byok}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{row.local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {capabilityRows.map((row) => (
          <article key={row.capability} className="rounded-xl border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-veyra-navy">{row.capability}</h3>
            <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
              <div>
                <dt className="font-semibold text-foreground">Cloud-only</dt>
                <dd className="mt-1 text-muted-foreground">{row.cloud}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Bring your own provider</dt>
                <dd className="mt-1 text-muted-foreground">{row.byok}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Local / hybrid</dt>
                <dd className="mt-1 text-muted-foreground">{row.local}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}

export default function AiConfigurationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section aria-labelledby="ai-configuration-title" className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
              AI configuration
            </p>
            <h1
              id="ai-configuration-title"
              className="mt-3 text-3xl font-bold tracking-tight text-veyra-navy md:text-4xl"
            >
              Choose how VEYRA thinks.
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              Compare cloud, bring-your-own-provider, and local or hybrid modes. Availability
              depends on your account, selected provider, supported model, and device.
            </p>
          </div>
        </section>

        <section aria-label="Operating modes" className="py-10 md:py-14">
          <div className="mx-auto grid max-w-[1280px] gap-4 px-5 md:grid-cols-2 lg:px-8 xl:grid-cols-3">
            {operatingModes.map((mode) => (
              <ModeCard key={mode.title} mode={mode} />
            ))}
          </div>
        </section>

        <section aria-labelledby="capabilities-title" className="bg-secondary/40 py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
                Compatibility
              </p>
              <h2
                id="capabilities-title"
                className="mt-3 text-2xl font-bold tracking-tight text-veyra-navy md:text-3xl"
              >
                Check capabilities in Desktop
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Provider and model support varies. Verify the current capability for your selected
                configuration in VEYRA Desktop; this overview is not a compatibility guarantee.
              </p>
            </div>
            <CapabilityTable />
          </div>
        </section>

        <section className="bg-white py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="flex flex-col gap-5 rounded-2xl border border-[#D6CBFF] bg-[#F5F2FF] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5638C4]">
                  Keep the modes distinct
                </p>
                <h2 className="mt-2 text-xl font-bold text-veyra-navy">
                  Local and BYOK are not VEYRA Cloud subscriptions.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Provider charges and hardware needs are separate. Cloud pricing and entitlements
                  come from verified Platform offers.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/pricing">
                    See pricing <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/download">Desktop availability</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
