'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PricingPreviewSection() {
  // Regional plans and prices are shown on the pricing page from Platform data.
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-veyra-navy mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">Plans and pricing are configured in the Veyra Platform.</p>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <h3 className="mb-2 text-lg font-semibold text-veyra-navy">See plans available in your region</h3>
          <p className="mx-auto mb-6 max-w-xl text-sm leading-6 text-muted-foreground">Current plans and regional prices are loaded from the VEYRA Platform. No sample pricing is shown.</p>
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
      a: 'VEYRA displays assistance in its Desktop workspace. What others can see depends on your desktop window and screen-sharing setup.',
    },
    {
      q: 'Is my data used to train AI models?',
      a: 'Data handling depends on the model provider and your account settings. Review provider terms before sending sensitive information; supported local models can keep processing on your device.',
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
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="rounded-2xl border border-border bg-veyra-navy p-10 lg:p-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to interview with confidence?</h2>
          <p className="text-muted-foreground/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Get live assistance during interviews and practise before they happen. VEYRA is your AI-powered interview companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-veyra-navy hover:bg-veyra-indigo/10">
                Get started free
              </Button>
            </Link>
            <Link href="/download">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Download Desktop app
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
