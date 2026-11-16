import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckCircle, Shield, Info } from 'lucide-react';

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about VEYRA.',
};

const faqs = [
  {
    q: 'Is VEYRA a chatbot?',
    a: 'No. VEYRA is an AI-powered interview system with two focused purposes: live interview assistance and interview practice. It is grounded in your CV and authorised context.',
  },
  {
    q: 'Does the interviewer know I am using VEYRA?',
    a: 'VEYRA displays guidance in its Desktop workspace. What others can see depends on your desktop window and screen-sharing setup.',
  },
  {
    q: 'Is my interview data used to train AI models?',
    a: 'Local models process requests on your device. Cloud processing depends on the provider and the consent settings you choose.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Your CVs, interview recordings, and private documents are not stored centrally by default. Backup is opt-in with explicit consent.',
  },
  {
    q: 'Do I need the Desktop app?',
    a: 'Yes. Live interview assistance and practice run in the VEYRA Desktop application. This website is the account portal and marketing site.',
  },
  {
    q: 'Which operating systems are supported?',
    a: 'Supported platforms are determined by the Veyra Platform release system. Check the Download page for verified installer availability.',
  },
  {
    q: 'How is billing handled?',
    a: 'Billing and subscriptions are managed by the Veyra Platform. Payment state comes from verified Platform records and webhooks.',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes. Account deletion and data export are available through your account settings.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="py-16 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-display-md font-bold text-veyra-navy mb-6">FAQ</h1>
            <p className="text-lg text-muted-foreground">
              Answers to common questions about VEYRA.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 lg:px-8">
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-sm font-semibold text-veyra-navy mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-veyra-navy mb-2">Still have questions?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact us and we will help.
                </p>
                <Link href="/contact" className="Button">
                  Contact us
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

