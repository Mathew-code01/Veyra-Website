import type { MetadataRoute } from 'next';
import { appUrl } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl.replace(/\/$/, '');
  const now = new Date();

  const routes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/features', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/how-it-works', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/live-copilot', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/ai-configuration', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/download', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
