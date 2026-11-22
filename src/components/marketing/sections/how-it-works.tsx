import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, FileText, Mic2, Layers3, Target } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: FileText,
      title: 'Add your context',
      description: 'Import your CV, projects and job description. Confirm what is true.',
    },
    {
      icon: Mic2,
      title: 'Start when you decide',
      description: 'Microphone and screen capture stay off until you press Start. State is always visible.',
    },
    {
      icon: Layers3,
      title: 'Get a grounded answer',
      description: 'See concise suggestions with the exact evidence behind them.',
    },
    {
      icon: Target,
      title: 'Review and practise',
      description: 'Turn each session into a report and targeted practice.',
    },
  ];

  return (
    <section className="bg-background py-10 min-[700px]:py-[72px]">
      <div className="mx-auto max-w-[1440px] px-5 min-[700px]:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 text-center min-[700px]:mb-10">
            <h2 className="text-2xl font-bold text-[#0F1B3D]">How it works</h2>
            <p className="mt-2 text-sm text-[#6B7694]">Four steps from setup to a better answer</p>
          </div>

          <div className="grid gap-4 min-[1100px]:grid-cols-4">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(15,27,61,0.06)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAE4FF] text-[#5638C4]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <span className="text-[13px] font-bold text-[#D6CBFF]">0{index + 1}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-[#0F1B3D]">{title}</h3>
                <p className="mt-2 text-sm leading-[21px] text-[#3B4766]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  const benefits = [
    {
      title: 'Desktop workspace',
      description: 'Assistance appears in the Desktop app. Visibility depends on which windows or screens you share.',
    },
    {
      title: 'Context-aware',
      description: 'Grounded in your CV and experience — not generic, one-size-fits-all advice.',
    },
    {
      title: 'Choose your processing mode',
      description: 'Local models process requests on your device. Cloud processing depends on the provider and the consent settings you choose.',
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-8">
              <div className="rounded-lg bg-veyra-indigo/5 p-3 mb-4 inline-flex">
                <Check className="h-5 w-5 text-veyra-indigo" />
              </div>
              <h3 className="text-lg font-semibold text-veyra-navy mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="py-20 border-y border-border bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-veyra-navy mb-4">Trust and privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                VEYRA does not store your CVs, interview recordings, or private documents centrally by default. Backup is opt-in
                with explicit consent and user-controlled retention.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-veyra-indigo shrink-0" />
                  <span className="text-muted-foreground">HTTPS protects Website and Desktop traffic in deployed environments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-veyra-indigo shrink-0" />
                  <span className="text-muted-foreground">No service-role credentials exposed to the browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 text-veyra-indigo shrink-0" />
                  <span className="text-muted-foreground">Account deletion and data export on request</span>
                </li>
              </ul>
            </div>
            <div className="text-right">
              <Link href="/privacy" className="Button">
                Read Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingPreviewSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-veyra-navy mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">Plans and pricing are configured in the Veyra Platform.</p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-[0_18px_50px_-36px_rgba(49,46,129,0.4)] sm:p-10">
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">See plans available in your region</h3>
          <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground mb-6">Current plan names, regional prices, and availability are loaded from the VEYRA Platform. The Website does not display sample pricing.</p>
          <Link href="/pricing"><Button>View live pricing</Button></Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Pricing is sourced live from the Veyra Platform. If no plans appear, commercial pricing has not yet been configured.
            {' '}
            <Link href="/pricing" className="text-sm font-medium text-veyra-indigo hover:underline">
              View pricing page
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function FAQPreviewSection() {
  const faqs = [
    {
      q: 'Is VEYRA a chatbot?',
      a: 'No. VEYRA is an AI-powered interview system focused on live assistance and practice, grounded in your CV and authorised context.',
    },
    {
      q: 'Does the interviewer know I am using VEYRA?',
      a: 'Assistance appears in the Desktop app. What others can see depends on your desktop window and screen-sharing setup.',
    },
    {
      q: 'Is my data used to train AI models?',
      a: 'Data handling depends on the model provider and the settings you choose. Review the provider terms before sending sensitive information, and choose a local model when available and appropriate.',
    },
  ];

  return (
    <section className="py-20 border-y border-border">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-veyra-navy mb-4">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-veyra-navy mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/faq" className="Button">
            View all FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="bg-[#F7F8FC] py-10 min-[700px]:py-[72px]">
      <div className="mx-auto max-w-[1280px] px-5 min-[700px]:px-16">
        <div className="rounded-2xl border border-[#E4E7F0] bg-[#0F1B3D] px-6 py-10 text-center min-[700px]:px-12 min-[700px]:py-14">
          <h2 className="text-balance text-[28px] font-bold leading-9 text-white min-[700px]:text-[36px] min-[700px]:leading-[44px]">
            Prepare once. Interview with confidence.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 min-[700px]:text-base">
            Explore VEYRA Desktop for interview preparation and optional in-session guidance.
            Available capabilities depend on the release and your configuration.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 min-[700px]:flex-row">
            <Link href="/download">
              <Button size="lg" className="w-full rounded-[10px] bg-white px-5 font-semibold text-[#0F1B3D] hover:bg-[#F5F2FF] min-[700px]:w-auto">
                Download VEYRA
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="w-full rounded-[10px] border-white/40 bg-white/5 px-5 font-semibold text-white hover:bg-white/10 min-[700px]:w-auto">
                See how it works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
