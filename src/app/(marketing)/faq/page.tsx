import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FAQContent } from '@/components/marketing/faq-content';

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about VEYRA.',
};

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
          <div className="px-4 lg:px-8">
            <FAQContent />
            <div className="mx-auto mt-8 max-w-[820px] rounded-xl border border-border bg-card p-6">
              <h2 className="mb-2 text-sm font-semibold text-veyra-navy">Still have questions?</h2>
              <p className="mb-4 text-sm text-muted-foreground">Contact us and we will help.</p>
              <Link href="/contact" className="Button">
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

