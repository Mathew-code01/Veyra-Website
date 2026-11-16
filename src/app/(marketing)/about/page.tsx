import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Github, Mail } from 'lucide-react';

export const metadata = {
  title: 'About',
  description: 'About VEYRA — the AI-powered interview copilot.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="py-16 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-display-md font-bold text-veyra-navy mb-6">About VEYRA</h1>
            <p className="text-lg text-muted-foreground">
              An AI-powered interview copilot built for candidates.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-veyra-navy mb-6">Our mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                VEYRA helps people interview with confidence. We believe every candidate deserves
                preparation and support — not just a generic chatbot, but a focused interview copilot.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                VEYRA consists of two parts: the VEYRA Desktop application (local AI inference,
                interview listening, practice engine) and the Veyra Platform (central backend for
                identity, accounts, billing, credits, devices, and releases). This website is the
                customer-facing experience and account portal.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="max-w-3xl mx-auto px-4 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-veyra-navy mb-6">Contact us</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-muted-foreground mb-6">
                    Have questions about VEYRA? Reach out to our team.
                  </p>
                  <Link href="/contact" className="Button">
                    Go to contact
                  </Link>
                </div>
                <div className="text-right">
                  <div className="flex justify-end gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-veyra-indigo" aria-label="GitHub">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href="mailto:support@veyra.example" className="text-muted-foreground hover:text-veyra-indigo" aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
