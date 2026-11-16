import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileText, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description: 'VEYRA Terms of Service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-2xl mx-auto px-4 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-veyra-navy mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: November 2026</p>

        <section className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            These terms govern your use of the VEYRA website and the Veyra Platform.
          </p>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-veyra-navy mb-3 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" /> Use of the service
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              VEYRA is an AI-powered interview system. Live assistance and practice run in the VEYRA Desktop
              application. This website is the customer-facing account portal.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-veyra-navy mb-3 flex items-start gap-2">
              <FileText className="h-5 w-5 mt-0.5 shrink-0" /> Billing
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Subscriptions and payments are managed by the Veyra Platform. Payment state comes from verified
              Platform records and webhooks. No charges are made without explicit action.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-veyra-navy mb-3 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" /> Account responsibility
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for your account credentials and authorised devices. You may revoke devices
              and delete your account from the dashboard at any time.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/" className="Button">
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

