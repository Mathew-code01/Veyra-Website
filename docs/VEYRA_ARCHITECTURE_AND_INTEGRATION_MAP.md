# VEYRA architecture and integration map

Discovery snapshot: 2026-11-20. This is a source-tree and entry-point map, not a claim that every contract has been exhaustively reviewed.

## Repositories

| Product | Repository / branch | Existing structure observed | Integration boundary |
|---|---|---|---|
| Desktop | `C:\Users\MATTHEW\Desktop\Veyra`, `feat/veyra-phases-12-22` | Electron, Vite/React client, `client/src/pages`, `client/src/stores`, `client/src/services/ipc`, `desktop/windows`, `desktop/services`, Express server, shared types/contracts/validation, database and tests. | Renderer uses IPC client/services and shared contracts; Electron main/preload owns privileged work; local server has routes/controllers/services/repositories. Inspect specific IPC handlers and API contracts before UI changes. |
| Website | `C:\Users\MATTHEW\Desktop\veyra-website`, `main` | Next.js 15 App Router/React, `src/app` route groups for marketing/auth/dashboard/admin, `src/components`, feature modules, platform services/client/endpoints/auth, Supabase SDK, server actions, tests. | Website calls the Platform through `src/services/platform`; preserve Supabase session/callback handling, service contracts, server actions and route guards. |
| Platform | `C:\Users\MATTHEW\Desktop\veyra-platform`, `phase-2/supabase-foundation` | API app, SDK and contracts packages; module-oriented Fastify-style routes/services for auth, users, account, plans, pricing, payments, subscriptions, entitlements, devices, releases, downloads, providers/models, usage, audit, admin, notifications and AI gateway; Supabase integration/migrations. | Platform is authoritative for identity, entitlements, price/payment state, devices, releases and privileged admin operations. Server-side auth/authorization and audit must remain authoritative. |

## Website routes observed

- Public: `/`, `/about`, `/contact`, `/download`, `/faq`, `/features`, `/how-it-works`, `/pricing`, `/privacy`, `/terms`.
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/callback` (route-group URLs omit the group name).
- Desktop handoff: `/desktop-auth`, `/desktop-auth/complete`.
- Customer dashboard: `/dashboard`, `/dashboard/billing`, `/dashboard/credits`, `/dashboard/devices`, `/dashboard/live-assistant`, `/dashboard/notifications`, `/dashboard/practice`, `/dashboard/settings`.
- Admin: `/admin`, `/admin/audit`, `/admin/credits`, `/admin/devices`, `/admin/errors`, `/admin/models`, `/admin/notifications`, `/admin/payments`, `/admin/plans`, `/admin/releases`, `/admin/roles`, `/admin/subscriptions`, `/admin/support`, `/admin/users`, `/admin/users/[userId]`.

The detailed manifest-to-route/screen mapping is in `VEYRA_DESIGN_COVERAGE_MATRIX.md`.

## Existing website integration surfaces observed

- `src/services/platform/endpoints.ts` centralizes the v1 route constants. Reviewed groups include auth/refresh, device register/list/revoke/authorize, entitlement check/list/snapshot, plan and subscription operations, checkout/payment history, credits/usage, module downloads/releases, AI models/invocation, regional pricing/exchange rates, notifications, account export/deletion/consent, and admin user/payment/audit/credit operations.
- `src/services/platform/client.ts` is the typed request wrapper and feature client. It attaches the access token where required, normalizes errors, correlates requests and restricts retries to idempotent GETs. Use its methods instead of constructing parallel requests.
- `src/services/platform/auth.ts` reads the access cookie and writes the refresh token as HTTP-only; session user data is fetched through `/auth/me` rather than stored in the cookie. Preserve its safe redirect handling and OAuth state cookies.
- Pricing page loads configured regional plans, only enables checkout for live offers, and treats payment verification as Platform-authoritative. Keep those guarantees when aligning WP-01..WP-07.
- Download page currently presents a no-published-installer empty state; Platform release/download authorization endpoints exist. Connect through the existing client when implementing WM-05/WC-04 rather than adding a download URL or release data locally.
- Website admin routes are UI surfaces. The platform has separate `admin` module routes/services and role checks; inspect authorization on each server operation before treating any admin screen as functional.

## Preservation requirements

- Do not duplicate desktop endpoints or the platform's user/subscription/device/provider tables.
- Do not replace canonical SDK/contracts with page-local copies.
- UI visibility is not authorization; platform endpoints must validate role and permission.
- Do not grant subscription entitlement based on a browser success page. The platform-verified entitlement remains authoritative.
- Authentication handoff stays browser based as implemented; do not invent token transfer through a custom URL.
- AI/provider support must be derived from the actual catalog/readiness response. Never mark an illustrative provider operational.
- For desktop changes, preserve IPC boundaries and avoid exposing secrets to renderer code.

## Unverified details

This first pass did not yet inspect every controller, route handler, migration, IPC channel or page's data calls. Follow the existing endpoint/type consumer before modifying a feature and update this document with concrete file paths and contract behavior.

## Desktop renderer details verified in continuation

- The production renderer entry is `client/src/main.tsx` → `client/src/app/App.tsx` / `client/src/app/router.tsx`; the separate root `src/App.tsx` is not the production entry. The app is Electron + Vite + React Router, with the Electron main/preload boundary for privileged operations.
- Main routes include `/`, `/preparation`, `/interview/setup`, `/practice`, `/live`, `/documents`, `/profile`, `/profile/experience`, `/profile/skills`, `/projects`, `/stories`, `/history`, `/history/:sessionId`, `/assessments`, `/analytics`, `/settings`, `/ai-setup`, `/account`, and `/overlay`. `analytics` currently maps to the Assessments screen and should be treated as an existing route behavior until reviewed.
- `client/src/pages/Dashboard/Dashboard.tsx` reads recent sessions through `window.veyra.practice.listSessions`, provider state through `window.veyra.providers.getStatus`, and hardware assessment through `window.veyra.hardware.getAssessment`. Renderer must remain free of raw provider credentials; provider settings writes/verification stay in main-process IPC and OS-backed storage.
- `client/src/components/layout/Sidebar.tsx`, `Header.tsx`, `AppShell.tsx` and `client/src/styles/globals.css` form the current renderer shell/theme. User-authored mobile navigation and active sidebar styling were preserved during the dashboard milestone.
- `vite.config.ts` now explicitly uses the existing `client/public` asset directory. Without this setting, the development server returned `index.html` for `/favicon.svg`; the sidebar mark request therefore had `naturalWidth === 0`. Vite `base: "./"` is retained for packaged relative asset resolution.
- Browser renderer QA used IPC stubs. It does not verify a real Electron session, operating-system permission prompt, provider health, hardware scan, or persisted practice session against the production runtime.
