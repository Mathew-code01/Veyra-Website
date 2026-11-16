# Veyra Website

Customer-facing website and account portal for the Veyra AI interview platform. Integrates with the Veyra Platform backend (supabase-backed Fastify API) via a typed client layer.

## Tech stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- React 18
- Framer Motion (interface animations)
- GSAP + ScrollTrigger (marketing scroll storytelling)
- Lucide React (icons)
- React Hook Form + Zod (forms & validation)
- Veyra Platform API authentication (Supabase Auth is used server-side by the Platform)
- Vitest + Testing Library (tests)

## Repository layout

```
veyra-website/
  src/
    app/              # Next.js App Router routes
    components/       # Shared UI components (layout, ui, marketing, dashboard, admin, auth)
    config/           # Site & navigation config
    features/         # Feature domains (auth, billing, devices, downloads, interview-assistant, notifications, practice, subscriptions, usage, administration)
    hooks/            # Shared React hooks
    lib/              # env, security, validation
    services/         # Platform API integration layer
    styles/           # Global styles & design tokens
    types/            # Shared TypeScript types
  docs/               # Platform integration audit, security notes
  public/             # Static assets (logo, favicon, images, fonts)
  tests/              # Unit, integration, e2e tests
```

## Local development

1. Copy `.env.example` to `.env.local` and fill in non-secret values.
2. Start the Veyra Platform API (`veyra-platform/apps/api`) on `http://localhost:3000`.
3. Install dependencies: `pnpm install`.
4. Run the website: `pnpm run dev` (serves on `http://localhost:5173`).
5. Open the Website at `http://localhost:5173`. The Platform exposes separate health and readiness routes at `http://localhost:3000/api/v1/health` and `/api/v1/ready`.

## Scripts

- `pnpm run dev` — start dev server on port 5173
- `pnpm run build` — production build
- `pnpm run start` — production server on port 5173
- `pnpm run typecheck` — TypeScript strict check
- `pnpm run lint` — ESLint
- `pnpm test` — Vitest test suite

## Platform integration

See `docs/PLATFORM_INTEGRATION_AUDIT.md` for the verified endpoint contract audit. The website never duplicates Platform business logic and never exposes service-role credentials to the browser.
