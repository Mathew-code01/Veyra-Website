import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Contact',
  description: 'Contact options and support availability for VEYRA.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-veyra-indigo">
            VEYRA support
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-veyra-navy">Contact us</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            We are preparing a support channel for account and product questions.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="support-status">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-veyra-indigo/10 text-veyra-indigo">
            <Mail aria-hidden="true" className="h-5 w-5" />
          </div>
          <h2 id="support-status" className="mb-2 text-xl font-semibold text-veyra-navy">
            Support messages are not connected yet
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            This page does not collect or send a message. We will enable contact once a verified support destination is configured.
            For now, the FAQ covers product and account basics.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/faq">
              <Button><MessageCircle aria-hidden="true" className="mr-2 h-4 w-4" />Read the FAQ</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Open account dashboard</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}