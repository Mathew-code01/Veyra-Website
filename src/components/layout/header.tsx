'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui';
import { ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { VeyraLogo } from '@/components/marketing/logo';

const PRODUCT_LINKS = [
  { href: '/features', label: 'Product overview' },
  { href: '/live-copilot', label: 'Live Copilot' },
  { href: '/features#practice-studio', label: 'Practice Studio' },
  { href: '/ai-configuration', label: 'AI configuration' },
];

const RESOURCE_LINKS = [
  { href: '/faq', label: 'FAQ' },
  { href: '/download', label: 'Downloads' },
  { href: '/about', label: 'About VEYRA' },
];

const PRIMARY_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/features#use-cases', label: 'Use cases' },
  { href: '/pricing', label: 'Pricing' },
] as const;

const SUPPORT_LINK = { href: '/contact', label: 'Support' };

function isCurrentPath(pathname: string, href: string) {
  const [route] = href.split('#');
  return pathname === route;
}

function NavigationLink({
  href,
  label,
  pathname,
  onClick,
  className = '',
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
  className?: string;
}) {
  const isCurrent = href === pathname;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isCurrent ? 'page' : undefined}
      className={`rounded-md font-medium transition-colors hover:text-veyra-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isCurrent ? 'text-veyra-indigo' : 'text-[#3B4766]'
      } ${className}`}
    >
      {label}
    </Link>
  );
}

function NavigationGroup({
  label,
  links,
  pathname,
}: {
  label: string;
  links: { href: string; label: string }[];
  pathname: string;
}) {
  const active = links.some(({ href }) => isCurrentPath(pathname, href));

  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1 rounded-md py-2 text-[13px] font-medium transition-colors hover:text-veyra-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden ${
          active ? 'text-veyra-indigo' : 'text-[#3B4766]'
        }`}
      >
        {label}
        <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-white p-2 shadow-[0_12px_32px_rgba(15,27,61,0.12)]">
        {links.map(({ href, label: itemLabel }) => (
          <NavigationLink
            key={href}
            href={href}
            label={itemLabel}
            pathname={pathname}
            className="block px-3 py-2.5 text-sm hover:bg-secondary"
          />
        ))}
      </div>
    </details>
  );
}

export function Header() {
  const { session, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isAuthenticated = !!session?.accessToken && !isLoading;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="flex h-[68px] w-full items-center justify-between gap-3 px-5 min-[700px]:px-12">
        <Link href="/" aria-label="VEYRA home" className="flex shrink-0 items-center gap-2">
          <VeyraLogo size="sm" />
          <span className="text-xl font-bold tracking-tight text-veyra-navy">VEYRA</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-3 lg:flex xl:gap-4">
          <NavigationGroup label="Product" links={PRODUCT_LINKS} pathname={pathname} />
          {PRIMARY_LINKS.map(({ href, label }) => (
            <NavigationLink
              key={href}
              href={href}
              label={label}
              pathname={pathname}
              className="py-2 text-[13px]"
            />
          ))}
          <NavigationGroup label="Resources" links={RESOURCE_LINKS} pathname={pathname} />
          <NavigationLink
            href={SUPPORT_LINK.href}
            label={SUPPORT_LINK.label}
            pathname={pathname}
            className="py-2 text-[13px]"
          />
        </nav>

        <div className="hidden shrink-0 items-center gap-2 min-[700px]:flex lg:gap-3">
          {!isLoading && (isAuthenticated ? (
            <>
              <Link href="/download">
                <Button variant="outline" size="sm">Download</Button>
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Open account menu"
                  aria-expanded={accountMenuOpen}
                  aria-controls="account-navigation"
                >
                  <Avatar size="sm" alt={session?.user?.email || 'User'} />
                </button>
                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: reduceMotion ? 0 : 0.14 }}
                      id="account-navigation"
                      className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-white shadow-lg"
                    >
                      <div className="space-y-1 border-b border-border p-4">
                        <p className="break-all text-sm font-medium text-veyra-navy">{session?.user?.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {session?.user?.emailConfirmed ? 'Verified' : 'Unverified'}
                        </p>
                      </div>
                      <div className="space-y-1 p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          <User aria-hidden="true" className="h-4 w-4" /> Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          <Settings aria-hidden="true" className="h-4 w-4" /> Settings
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                        >
                          <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get VEYRA</Button>
              </Link>
            </>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex items-center justify-center rounded-md p-2 text-[#3B4766] transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
          aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-68px)] overflow-y-auto border-t border-border bg-white px-5 py-4 shadow-lg min-[700px]:px-12 lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="space-y-1">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</p>
              {PRODUCT_LINKS.map(({ href, label }) => (
                <NavigationLink
                  key={href}
                  href={href}
                  label={label}
                  pathname={pathname}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 text-sm"
                />
              ))}
              {[...PRIMARY_LINKS, SUPPORT_LINK].map(({ href, label }) => (
                <NavigationLink
                  key={href}
                  href={href}
                  label={label}
                  pathname={pathname}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 text-sm"
                />
              ))}
              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resources</p>
              {RESOURCE_LINKS.map(({ href, label }) => (
                <NavigationLink
                  key={href}
                  href={href}
                  label={label}
                  pathname={pathname}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 text-sm"
                />
              ))}
            </nav>
            {!isLoading && (
              <div className="mt-3 space-y-1 border-t border-border pt-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" onClick={closeMobileMenu} className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#3B4766] hover:bg-secondary">Dashboard</Link>
                    <Link href="/dashboard/settings" onClick={closeMobileMenu} className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#3B4766] hover:bg-secondary">Settings</Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        logout();
                      }}
                      className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu} className="block rounded-md px-3 py-2.5 text-sm font-medium text-[#3B4766] hover:bg-secondary">Sign in</Link>
                    <Link href="/register" onClick={closeMobileMenu} className="block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90">Get VEYRA</Link>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
