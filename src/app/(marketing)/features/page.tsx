import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Mic, Watch, GraduationCap, Shield, Monitor, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Features',
  description: 'VEYRA features — live interview assistance and interview practice.',
};

const capabilityCards = [
  {
    icon: Mic,
    title: 'Live interview assistance',
    description:
      'VEYRA Desktop can use supported microphone or screen context after you enable the relevant permission. Guidance is shown in its desktop workspace; visibility depends on your window and screen-sharing setup.',
    detail:
      'VEYRA Desktop can use supported microphone or screen context after you enable the relevant permission. Guidance is shown in its desktop workspace; visibility depends on your window and screen-sharing setup.',
  },
  {
    icon: Watch,
    title: 'Interview practice',
    description:
      'Simulated interview sessions with AI-generated questions, answer feedback, and improvement suggestions before the real interview.',
    detail:
      'Practise role-specific questions, receive AI feedback on clarity and structure, and track your progress over time. Available through the VEYRA Desktop application.',
  },
  {
    icon: GraduationCap,
    title: 'Personalised to you',
    description:
      'Assistance is grounded in your CV, experience, skills, and authorised context — tailored to your target role.',
    detail:
      'You control what context is authorised. VEYRA adapts its guidance to your background rather than offering generic advice.',
  },
  {
    icon: Shield,
    title: 'Privacy-first design',
    description:
      'Your interview content stays on your device unless you explicitly opt into cloud backup. We never use your data to train models.',
    detail:
      'Backup is opt-in with explicit consent and user-controlled retention. You can delete your account and export your data at any time.',
  },
  {
    icon: Monitor,
    title: 'Account and device management',
    description:
      'Register and authorise devices, manage your subscription and credits, and view usage through the customer dashboard.',
    detail:
      'The Veyra Platform is the source of truth for identity, entitlements, subscriptions, payments, credits, and devices.',
  },
  {
    icon: CheckCircle,
    title: 'Practice history and feedback',
    description:
      'Review past practice sessions, feedback, and answer improvements to track readiness over time.',
    detail:
      'Practice history is stored in your account and accessible from the dashboard (subject to your plan entitlements).',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="py-16 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-display-md font-bold text-veyra-navy mb-6">Features</h1>
            <p className="text-lg text-muted-foreground">
              Everything VEYRA offers to help you interview with confidence.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {capabilityCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-xl border border-border bg-card p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="rounded-xl bg-veyra-indigo/10 p-4 mb-6 inline-flex">
                    <card.icon className="h-6 w-6 text-veyra-indigo" />
                  </div>
                  <h3 className="text-xl font-semibold text-veyra-navy mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{card.description}</p>
                  <details className="text-xs text-muted-foreground leading-relaxed">
                    <summary className="font-medium text-veyra-indigo cursor-pointer hover:underline">Learn more</summary>
                    <p className="mt-2">{card.detail}</p>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="max-w-3xl mx-auto px-4 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-10 lg:p-16">
              <h2 className="text-3xl font-bold text-veyra-navy mb-6">Live assistance vs practice</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-veyra-navy">Live interview assistance</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Optional live cues with permission</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Based on your CV and authorised context</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Displayed in the Desktop workspace</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Requires VEYRA Desktop app</li>
                  </ul>
                </div>
                <div className="space-y-4 border-l border-border pl-8">
                  <h3 className="text-lg font-semibold text-veyra-navy">Interview practice</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Simulated interview sessions</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>AI-generated questions and feedback</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Answer improvement suggestions</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-3 w-3 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-600"><span className="h-2 w-2 text-emerald-500">✓</span></span>Requires VEYRA Desktop app</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="/download">
                  <Button>Download Desktop app</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline">How it works</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

