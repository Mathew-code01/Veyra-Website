'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, List, Check, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();
  const steps = [
    {
      step: '01',
      title: 'Set up your profile',
      description:
        'Add your CV, experience, skills, and target roles. VEYRA uses this authorised context to tailor assistance and practice questions.',
    },
    {
      step: '02',
      title: 'Choose your mode',
      description:
        'Select live interview assistance for real-time cues during an interview, or interview practice to prepare beforehand.',
    },
    {
      step: '03',
      title: 'Interview with confidence',
      description:
        'Use Desktop guidance when you choose, then review practice feedback and prepare for your next interview.',
    },
  ];

  return (
    <section className="py-20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-veyra-navy mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From setup to confident interviewing in three steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.step}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-veyra-indigo text-white font-bold">
                  {step.step}
                </div>
                <Play className="h-5 w-5 text-veyra-indigo" />
              </div>
              <h3 className="text-lg font-semibold text-veyra-navy mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
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
