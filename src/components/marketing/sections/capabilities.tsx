'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic, Watch, GraduationCap, Shield, CheckCircle } from 'lucide-react';

const features = [
  {
    title: 'Live interview assistance',
    description:
      'Optional Desktop guidance based on context you choose. Capture requires explicit permission, and what others can see depends on your window and screen-sharing setup.',
    icon: Mic,
  },
  {
    title: 'Interview practice',
    description:
      'Simulated interview sessions with AI-generated questions, answer feedback, and improvement suggestions before the real thing.',
    icon: Watch,
  },
  {
    title: 'Personalised to you',
    description:
      'Assistance is grounded in your supplied CV and experience — not generic advice. You control what context is authorised.',
    icon: GraduationCap,
  },
  {
    title: 'Privacy-first by design',
    description:
      'Local processing is available for supported models. Cloud processing and data handling depend on the provider and settings you choose; review provider terms before sending sensitive content.',
    icon: Shield,
  },
];

export function LiveAssistanceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-20 border-y border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-veyra-navy mb-4">Two ways to prepare</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            VEYRA supports you before and during the interview. Choose the experience that fits your stage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: idx * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-veyra-indigo/50 transition-colors"
            >
              <div className="rounded-xl bg-veyra-indigo/10 p-3 mb-4 group-hover:bg-veyra-indigo/20 transition-colors inline-flex">
                <feature.icon className="h-5 w-5 text-veyra-indigo" />
              </div>
              <h3 className="text-xl font-semibold text-veyra-navy mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{feature.description}</p>
              <Link href="/how-it-works" className="text-sm font-medium text-veyra-indigo flex items-center gap-1 hover:underline">
                Learn more <span className="h-4 w-4" aria-hidden="true">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PracticeSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-veyra-navy mb-6">Practise before the interview</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Simulated sessions with AI-generated questions tailored to your target role. Get feedback on your answers and
              concrete suggestions to improve — so you walk in prepared.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-sm text-muted-foreground">Role-specific practice questions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-sm text-muted-foreground">AI feedback on clarity, structure, and impact</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-sm text-muted-foreground">Answer improvement suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-sm text-muted-foreground">Practice history and progress tracking</span>
              </li>
            </ul>
            <Link href="/download" className="Button">
              Download the Desktop app
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-veyra-indigo to-veyra-violet rounded-2xl blur opacity-20" />
            <div className="relative rounded-2xl border border-border bg-background shadow-xl overflow-hidden h-[400px] flex flex-col">
              <div className="bg-secondary/50 p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-muted-foreground">Practice flow example</span>
                </div>
              </div>
              <div className="flex-1 bg-secondary/40 flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <Watch className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Practice interface preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

