import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/components/auth/auth-provider';
import { appUrl } from '@/lib/env';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#6B4FE0',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | VEYRA',
    default: 'VEYRA — Privacy-first AI interview copilot',
  },
  description:
    'VEYRA is a privacy-first AI interview copilot. Practice STAR stories with feedback, prepare candidate evidence, and receive context-aware assistance during live interviews.',
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'VEYRA',
    title: 'VEYRA — Privacy-first AI interview copilot',
    description:
      'Practice STAR stories with feedback, prepare candidate evidence, and receive context-aware assistance during live interviews. Cloud, BYOK, or private local-only.',
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    images: [
      {
        url: '/og-card.svg',
        width: 1200,
        height: 630,
        alt: 'VEYRA — Privacy-first desktop AI interview copilot',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEYRA — Privacy-first AI interview copilot',
    description:
      'Practice STAR stories with feedback, prepare candidate evidence, and receive context-aware assistance during live interviews.',
    images: ['/og-card.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
