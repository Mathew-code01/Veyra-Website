export default {
  // Keep `next dev` output separate from `next build` / `next start`. A build
  // or a second server must not replace chunks beneath a process that has
  // already emitted HTML referencing the previous build ID.
  distDir: process.env.VEYRA_NEXT_DIST_DIR || (process.env.NODE_ENV === 'development' ? '.next-dev' : '.next'),
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {},
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
}
