# VEYRA ecosystem baseline audit

**Audit date:** 2026-11-15 (Africa/Johannesburg)  
**Status:** Initial source-based baseline. Static discovery is recorded here; full runtime, database, integration, and visual verification remains in progress.

## Repository state and scope

| Project | Location | Git state observed | Initial role |
|---|---|---|---|
| Desktop | `C:\Users\MATTHEW\Desktop\Veyra` | Branch `feat/veyra-phases-12-22`; many modified and untracked files already present; origin points to `Mathew-code01/Veyra`. | Electron application, interview runtime, local inference, desktop UI and IPC. |
| Platform | `C:\Users\MATTHEW\Desktop\veyra-platform` | Branch `phase-2/supabase-foundation`; modified files already present; origin points to `Mathew-code01/Veyra-platform`. | Fastify API, Supabase integration, contracts, SDK, shared account and commerce services. |
| Website | `C:\Users\MATTHEW\Desktop\veyra-website` | No `.git` directory is present in the workspace, so branch, remotes, and commit/push state cannot be read here. | Next.js marketing site and customer/admin portal. |

Existing Desktop and Platform changes were treated as user work and not overwritten. The Platform `.env` file was not read. No remote database, payment provider, OAuth credentials, or production state was accessed.

## Dependency and integration map

| Area | Observed implementation | Baseline classification |
|---|---|---|
| Website runtime | Next.js 15 App Router, React 18, TypeScript, Tailwind, Framer Motion, GSAP, Lucide; Website package scripts use port 5173. | Implemented. |
| Website Platform access | `src/services/platform/client.ts` and `endpoints.ts` implement a custom typed REST client. Website does not import the Platform workspace SDK. | Implemented, but contracts can drift from Platform packages. |
| Website identity | Register/login/logout/refresh are Platform server actions with cookie storage. Access token is JavaScript-readable for direct authenticated API calls; refresh token is HttpOnly. Supabase client is used directly on password reset. | Partially integrated; password-reset flow is inconsistent and requires an end-to-end verification/fix. |
| Website customer portal | Dashboard, billing, credits/usage, devices, notifications, settings, practice explanation, and live-assistant entitlement pages exist. Billing requests subscription, plans, and customer payment history; credits requests balance and usage history. | Implemented and connected in code; live data and failure states not yet integration-tested. |
| Website admin | Overview and user, subscription, payment, credit, device, plan, model, release, notification, role, audit, support, and error pages exist. Platform contains server-side role checks. | Partially implemented; every route/action still needs runtime authorization verification. |
| Website pricing/download | Pricing requests country and plan data from Platform. Download page is designed to show unavailable state when no verified release exists. | Connected in code; remote data/assets not verified. |
| Platform runtime | Node 20 workspace with Fastify 5, Zod, Supabase client, CORS, Helmet, rate limiting; API defaults to port 3000. `main.ts` loads `.env`, validates config, builds routes, then binds `0.0.0.0`. | Implemented; startup and readiness not yet run in this audit. |
| Platform routes | `app.ts` registers auth, devices, entitlements, plans, subscriptions, payments, credits, usage, AI gateway, modules, downloads, releases, pricing, backups, notifications, admin, account, and health routes. | Route registration observed; endpoint behavior requires route tests and configured service verification. |
| Platform usage and billing history | `GET /api/v1/usage` and `GET /api/v1/payments/history` exist and the Website calls them. Both return capped lists (100 records); there is no pagination contract visible in these handlers. | Implemented, not missing as older Website reports claimed; pagination remains limited. |
| Platform AI and payments | AI gateway and mock provider paths exist. Paystack adapter code includes signature verification, while mock provider accepts test signatures; selected runtime provider/config was not read. | Provider capability exists; production configuration is unverified. |
| Platform contract/SDK use | Platform has `packages/contracts` and `packages/sdk`; neither Website nor Desktop package declares the SDK. Website maintains duplicate response shapes. | Implemented in Platform, not consumed by either client. |
| Desktop application | Electron 39, Vite 8, React 19, TypeScript 6, SQLite/Drizzle, Transformers.js, ONNX Runtime, local voice/model dependencies. `core/` contains interview, prompts, vision, documents, preparation, local and cloud provider systems. | Product architecture present; feature-by-feature runtime verification remains. |
| Desktop Platform integration | `desktop/ipc/platform.ipc.ts` implements a main-process Platform client for browser/email-password sign-in, secure session storage, refresh, device registration, account/entitlement refresh, profile update and Website handoff. It is exposed only through typed preload IPC. | Implemented in source and security-bounded; live authorization, revocation propagation and network failure behavior remain unverified end to end. |
| Local AI | Desktop package includes local inference/runtime dependencies and provider/model services. | Implemented in source; hardware readiness and actual inference not verified. |
| Desktop development port | `vite.config.ts` sets host `127.0.0.1`, port 5173, `strictPort: true`. Website also starts on 5173. | Confirmed startup conflict when both clients are started together. |
| Releases | Platform release/download route families exist; Website download UI checks availability. Actual signed/published installers and integrity verification through Desktop updater were not verified. | Requires external release assets and end-to-end verification. |

## Website source findings

- `src/config/site.ts` had an application URL fallback of `http://localhost:3001`, while the actual Next.js script and `.env.example` use `http://localhost:5173`.
- `isTrustedRedirect()` compared `URL.origin` to the full configured application URL, causing valid absolute same-origin redirects to be rejected. Relative allowlisted redirects still worked.
- Dashboard overview rendered `0.00 USD` before credit data loaded or when it was unavailable, which could be mistaken for a real balance.
- Marketing copy implied support for every desktop application and suggested automatic/private live capture. This overstated behavior and permission controls.
- The Website has no Git metadata in this workspace, so its existing branch/working-tree changes cannot be distinguished from baseline and no commit can be made from this checkout.

## Verification evidence collected

- Website `pnpm run typecheck`: passed (exit code 0).
- Website `pnpm test` under the normal sandbox: Vitest/esbuild could not resolve its local config because the sandbox denied access to `../..`.
- Website `pnpm test` with the requested elevated execution: passed, 6 test files and 21 tests.
- Platform startup, Platform tests/build, Desktop tests/build, cross-project API calls, OAuth, payment sandbox, RLS, release signatures, and responsive browser checks: not yet run. No claims of success are made for these.

## Immediate confirmed blockers

1. Desktop dev server and Website both claim port 5173; Desktop uses `strictPort`, so both cannot start together.
2. Desktop uses its own main-process typed Platform client rather than the Platform workspace SDK. This is acceptable if it remains a transport adapter, but response contracts should be reconciled with Platform packages to prevent drift.
3. Website maintains a custom typed Platform client and does not consume the Platform workspace SDK directly.
4. Website password recovery sends through Platform, while password update uses Supabase directly; its Supabase client disables URL session detection. The full recovery callback cannot be considered working.
5. Platform's current local startup issue remains undiagnosed until a safe startup/readiness check can be run.
6. Website checkout/payment state, remote plan seeding, OAuth provider state, email delivery, installer publication, and storage configuration require environment/provider verification.

## Prioritized next steps

1. Resolve the 5173 collision (reserve Website 5173 and move Desktop Vite to a documented port such as 5174).
2. Reconcile the Platform API contract with the Desktop and Website; remove duplicate Desktop account/billing authority and connect the Desktop to Platform.
3. Fix password recovery using a validated, server-owned redirect and a coherent Supabase/Platform token exchange.
4. Run Platform startup/health tests and all project suites/builds without touching production data.
5. Verify device revocation, entitlement refresh, usage accounting, release signature checks, and ownership/RLS under integration tests.
6. Complete visual inspection at the requested viewports, then document limitations and repository Git state.
## Verification update — 2026-11-15

Website final typecheck, test suite (6 files / 22 tests), and production build pass. Platform final typecheck/build pass; API suite passes 18 files / 124 tests, including password-recovery redirect-origin coverage. Platform started on loopback port 3127; health and readiness both returned `ok` before shutdown. Desktop TypeScript build mode and renderer Vite build pass; the full test suite did not complete and Electron/native packaging remains unverified. See `VEYRA_ECOSYSTEM_FINAL_REPORT.md` for detailed blockers and source-level integration status.