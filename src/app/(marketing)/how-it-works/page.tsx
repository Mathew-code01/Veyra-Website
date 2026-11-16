import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Play, List, Check, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'How it works',
  description: 'How VEYRA works — from setup to confident interviewing.',
};

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
      'Get private, AI-generated guidance in the moment, then review feedback and improve your answers before the next one.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="py-16 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-display-md font-bold text-veyra-navy mb-6">How it works</h1>
            <p className="text-lg text-muted-foreground">
              From setup to confident interviewing in three steps.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.step} className="rounded-xl border border-border bg-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-veyra-indigo text-white font-bold">
                      {step.step}
                    </div>
                    <Play className="h-5 w-5 text-veyra-indigo" />
                  </div>
                  <h3 className="text-xl font-semibold text-veyra-navy mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 lg:px-8">
            <div className="rounded-2xl border border-border bg-veyra-indigo/5 p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-veyra-navy mb-6">What to expect</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-veyra-navy mb-4">During a live interview</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-veyra-indigo" />VEYRA listens to or captures the interview question.</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-veyra-indigo" />AI generates relevant assistance based on your authorised context.</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-veyra-indigo" />You see private cues and suggested answers — the interviewer does not.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-veyra-navy mb-4">During practice</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><List className="h-4 w-4 mt-0.5 text-veyra-indigo" />Simulated questions tailored to your target role.</li>
                    <li className="flex items-start gap-2"><List className="h-4 w-4 mt-0.5 text-veyra-indigo" />AI feedback on clarity, structure, and impact.</li>
                    <li className="flex items-start gap-2"><List className="h-4 w-4 mt-0.5 text-veyra-indigo" />Improvement suggestions and progress tracking.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-veyra-navy mb-6">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">Download the VEYRA Desktop app and create your account.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Get started free</Button>
              </Link>
              <Link href="/download">
                <Button size="lg" variant="outline">Download Desktop app</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

