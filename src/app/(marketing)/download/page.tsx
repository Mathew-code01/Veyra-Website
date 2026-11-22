import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CircleAlert,
  Download,
  FileText,
  Monitor,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Download | VEYRA',
  description:
    'Check VEYRA Desktop installer availability and release details.',
};

const releaseDetails = [
  {
    label: 'Version and release notes',
    value: 'Shown when a verified release is published.',
  },
  {
    label: 'Platform and file details',
    value: 'Shown only for available, verified release assets.',
  },
  {
    label: 'Signing and checksums',
    value: 'No claim is made until the release metadata is verified.',
  },
];

const installSteps = [
  {
    number: '01',
    title: 'Wait for a published release',
    description:
      'This page will show an installer only when an authorized release asset is available.',
  },
  {
    number: '02',
    title: 'Review the release details',
    description:
      'Check the listed platform and the file information provided with that release.',
  },
  {
    number: '03',
    title: 'Follow Desktop setup',
    description:
      'After installation, use the setup options available in your Desktop release.',
  },
];

function ReleaseDetails() {
  return (
    <dl className="divide-y divide-border">
      {releaseDetails.map(({ label, value }) => (
        <div
          key={label}
          className="grid gap-1 py-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-5"
        >
          <dt className="text-sm font-semibold text-veyra-navy">{label}</dt>
          <dd className="text-sm leading-6 text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section aria-labelledby="download-title" className="border-b border-border bg-white py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
              VEYRA Desktop
            </p>
            <h1
              id="download-title"
              className="mt-3 text-3xl font-bold tracking-tight text-veyra-navy md:text-4xl"
            >
              Get VEYRA for your desktop
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
              Installer links and platform details appear only when a release is published and
              verified.
            </p>
          </div>
        </section>

        <section aria-labelledby="release-status-title" className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <article className="mx-auto max-w-[760px] rounded-2xl border-2 border-veyra-indigo bg-card p-5 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-veyra-indigo/10 text-veyra-indigo">
                  <Monitor aria-hidden="true" className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 id="release-status-title" className="text-xl font-bold text-veyra-navy">
                      VEYRA Desktop installer
                    </h2>
                    <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      Not available
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    No verified installer is available from this page right now.
                  </p>
                </div>
                <Button disabled className="w-full shrink-0 sm:w-auto">
                  <Download aria-hidden="true" className="h-4 w-4" />
                  No verified installer
                </Button>
              </div>

              <div className="my-6 border-t border-border" />

              <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                <CircleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  We won’t link a placeholder file or infer platform support. Availability is
                  determined by published release assets.
                </p>
              </div>

              <div className="mt-6">
                <ReleaseDetails />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/contact">
                    Contact support <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/how-it-works">How VEYRA works</Link>
                </Button>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="install-steps-title" className="bg-secondary/40 py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
                When a release is available
              </p>
              <h2
                id="install-steps-title"
                className="mt-3 text-2xl font-bold tracking-tight text-veyra-navy md:text-3xl"
              >
                A clear path to Desktop
              </h2>
            </div>
            <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {installSteps.map((step) => (
                <li key={step.number} className="rounded-xl border border-border bg-white p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-veyra-indigo/10 text-sm font-bold text-veyra-indigo">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-veyra-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white py-12 md:py-14">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 border-t border-border px-5 pt-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-veyra-indigo" />
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Sign-in, billing, and device entitlements do not make an installer available or
                verify a release.
              </p>
            </div>
            <Link
              href="/privacy"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-veyra-indigo transition-colors hover:text-veyra-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Privacy controls <FileText aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
