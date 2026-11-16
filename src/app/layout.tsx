import { AuthProvider } from '@/components/auth/auth-provider';
import { appUrl } from '@/lib/env';
import './globals.css';

export const metadata = {
  title: {
    template: '%s | VEYRA',
    default: 'VEYRA — Your AI interview copilot',
  },
  description:
    'VEYRA is your AI-powered interview copilot. Prepare for interviews and get intelligent assistance across the applications you use on your computer.',
  metadataBase: new URL(appUrl),
  openGraph: {
    siteName: 'VEYRA',
    title: 'VEYRA — Your AI interview copilot',
    description:
      'VEYRA is your AI-powered interview copilot. Prepare for interviews and get intelligent assistance across the applications you use on your computer.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEYRA — Your AI interview copilot',
    description:
      'VEYRA is your AI-powered interview copilot. Prepare for interviews and get intelligent assistance across the applications you use on your computer.',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
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
