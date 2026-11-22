import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VEYRA — AI Interview Copilot',
    short_name: 'VEYRA',
    description: 'Privacy-first AI interview copilot for interview preparation and context-aware live assistance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8fc',
    theme_color: '#6B4FE0',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/veyra-symbol.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
  };
}
