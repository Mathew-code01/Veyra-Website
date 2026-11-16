import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Shield, FileText, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'VEYRA Privacy Policy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-2xl mx-auto px-4 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-veyra-navy mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: November 2026</p>

        <section className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            VEYRA respects your privacy. This policy describes how VEYRA handles your information.
          </p>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-veyra-navy mb-3 flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5 shrink-0" /> Data we do not store centrally
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Your CVs, interview recordings, and private documents are not stored centrally by default.
              Backup is opt-in with explicit consent and user-controlled retention.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-veyra-navy mb-3 flex items-start gap-2">
              <FileText className="h-5 w-5 mt-0.5 shrink-0" /> Account data
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Your email, profile, subscription, credits, devices, and usage are managed by the Veyra Platform.
              You can request account deletion and data export from your account settings.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-veyra-navy mb-3 flex items-start gap-2">
              <UserCheck className="h-5 w-5 mt-0.5 shrink-0" /> Authentication
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Sign-in is handled through Supabase Auth (email/password or OAuth). Session tokens are
              managed in secure cookies and never stored in localStorage.
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

