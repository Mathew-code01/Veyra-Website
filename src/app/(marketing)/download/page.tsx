import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Download, Monitor, Shield } from 'lucide-react';

export const metadata = {
  title: 'Download',
  description: 'Download the VEYRA Desktop application.',
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="py-16 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-display-md font-bold text-veyra-navy mb-6">Download</h1>
            <p className="text-lg text-muted-foreground">
              Get the VEYRA Desktop application. Installers are served only when verified through the Platform release system.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-veyra-navy mb-6">Desktop application</h2>
              <p className="text-muted-foreground mb-8">
                Live interview assistance and interview practice run in the VEYRA Desktop application.
                Downloads are authorised through the Veyra Platform release system.
              </p>

              <div id="download-placeholder" className="space-y-4">
                <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
                  <Download className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-veyra-navy mb-2">No verified installers available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Platform release system has not published any installer assets yet. Check back soon.
                  </p>
                  <Link href="/">
                    <Button variant="outline">Return home</Button>
                  </Link>
                </div>
              </div>

              <div className="mt-12 rounded-xl border border-border bg-secondary/50 p-8">
                <h3 className="text-lg font-semibold text-veyra-navy mb-4">Supported platforms</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported operating systems are determined by the Platform release metadata and are shown only when verified.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span>Windows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span>macOS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span>Linux</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Actual availability per platform is confirmed via the Platform release API (GET /api/v1/releases).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

