'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, Badge } from '@/components/ui';
import { Menu, X, User, LogOut, Settings, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { VeyraLogo } from '@/components/marketing/logo';
import { isTrustedRedirect } from '@/lib/security/redirects';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/download', label: 'Download' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export function Header() {
  const { session, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const isAuthenticated = !!session?.accessToken && !isLoading;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/95">
      <div className="flex w-full flex-row items-center justify-between gap-2 px-4 py-3 lg:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <VeyraLogo size="md" />
            <span className="font-bold text-xl tracking-tight text-veyra-navy">VEYRA</span>
          </Link>
        </div>

        <nav className="hidden items-center space-x-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-veyra-indigo"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-accent"
                aria-label="Open user menu"
                aria-expanded={accountMenuOpen}
                aria-controls="account-navigation"
              >
                <Avatar size="sm" src={undefined} alt="User" />
                <span className="absolute -right-1 -bottom-1 flex h-2 w-2 items-center justify-center">
                  <Badge variant="success" className="h-2 w-2 px-0 py-0">●</Badge>
                </span>
              </button>
              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                    id="account-navigation"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg"
                  >
                    <div className="p-4 space-y-2 border-b border-border">
                      <p className="text-sm font-medium">{session?.user?.email}</p>
                      <p className="text-xs text-muted-foreground">{session?.user?.emailConfirmed ? 'Verified' : 'Unverified'}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => { setAccountMenuOpen(false); window.location.href = '/dashboard'; }}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <User className="h-4 w-4" /> Dashboard
                      </button>
                      <button
                        onClick={() => { setAccountMenuOpen(false); window.location.href = '/dashboard/settings'; }}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full border-t border-border bg-background px-4 py-4 lg:hidden"
          >
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground py-2 transition-colors hover:text-veyra-indigo"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block text-sm font-medium text-muted-foreground py-2">Dashboard</Link>
                    <Link href="/dashboard/settings" className="block text-sm font-medium text-muted-foreground py-2">Settings</Link>
                    <button onClick={logout} className="block w-full text-left text-sm font-medium text-destructive py-2">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-sm font-medium text-muted-foreground py-2">Sign in</Link>
                    <Link href="/register" className="block w-full text-center text-sm font-medium text-primary bg-primary/10 py-2 rounded-md">Get started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

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
              Your AI interview copilot. Prepare, practice, and perform with confidence.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/features" className="hover:text-veyra-indigo">Features</a></li>
              <li><a href="/how-it-works" className="hover:text-veyra-indigo">How it works</a></li>
              <li><a href="/pricing" className="hover:text-veyra-indigo">Pricing</a></li>
              <li><a href="/download" className="hover:text-veyra-indigo">Download</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-veyra-indigo">About</a></li>
              <li><a href="/contact" className="hover:text-veyra-indigo">Contact</a></li>
              <li><a href="/faq" className="hover:text-veyra-indigo">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-veyra-indigo">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-veyra-indigo">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>VEYRA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-foreground">Privacy</a>
            <a href="/terms" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
