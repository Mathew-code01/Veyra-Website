import type { MetadataRoute } from 'next';
import { appUrl } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = appUrl.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/pricing',
          '/faq',
          '/how-it-works',
          '/download',
          '/about',
          '/contact',
          '/terms',
          '/privacy',
          '/ai-configuration',
          '/live-copilot',
        ],
        disallow: [
          '/admin/',
          '/dashboard/',
          '/desktop-auth/',
          '/callback',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
