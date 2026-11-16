import Link from 'next/link';
import { VeyraLogo } from '@/components/marketing/logo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <VeyraLogo size="md" />
              <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered interview assistance and practice. Secure, private, and built for candidates.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-veyra-indigo">Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-veyra-indigo">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-veyra-indigo">Pricing</Link></li>
              <li><Link href="/download" className="hover:text-veyra-indigo">Download</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-veyra-indigo">About</Link></li>
              <li><Link href="/contact" className="hover:text-veyra-indigo">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-veyra-indigo">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-veyra-indigo">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-veyra-indigo">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>VEYRA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
