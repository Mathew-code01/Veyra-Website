import Link from 'next/link';
import { VeyraLogo } from '@/components/marketing/logo';

const FOOTER_GROUPS = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/live-copilot', label: 'Live Copilot' },
      { href: '/ai-configuration', label: 'AI configuration' },
      { href: '/features#practice-studio', label: 'Practice Studio' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/download', label: 'Download' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/features#use-cases', label: 'Use cases' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact and support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of service' },
      { href: '/privacy', label: 'Privacy policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-12 min-[700px]:px-12 min-[700px]:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 min-[700px]:grid-cols-4 min-[1100px]:grid-cols-[minmax(240px,1.5fr)_repeat(4,minmax(120px,1fr))] min-[1100px]:gap-10">
          <div className="col-span-2 min-[1100px]:col-span-1">
            <Link href="/" aria-label="VEYRA home" className="mb-4 inline-flex items-center gap-2">
              <VeyraLogo size="sm" />
              <span className="text-xl font-bold tracking-tight text-veyra-navy">VEYRA</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Privacy-first interview preparation and optional Desktop guidance, with capture under your control.
            </p>
          </div>

          {FOOTER_GROUPS.map(({ title, links }) => (
            <nav key={title} aria-label={`${title} links`}>
              <h2 className="mb-4 text-sm font-semibold text-veyra-navy">{title}</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="transition-colors hover:text-veyra-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between">
          <p>© VEYRA</p>
          <p>Interview preparation and optional Desktop guidance.</p>
        </div>
      </div>
    </footer>
  );
}
