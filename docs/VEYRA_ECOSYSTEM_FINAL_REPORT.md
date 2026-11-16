# VEYRA ecosystem engineering report (work in progress)

Date: 2026-11-15

## Scope and evidence

The Website repository is the only writable checkout in this environment. The Desktop and Platform checkouts were inspected and their build/typecheck/test commands were attempted, but edits and commits outside the Website require additional filesystem access. Existing user modifications in those repositories were preserved. This report separates observed source state from runtime-verified behavior; this is not a declaration that the full ecosystem mission is complete.

## Architecture observed

- Website: Next.js 15 App Router, React 18, TypeScript, Tailwind, Framer Motion, GSAP and Lucide. It calls the Platform through a Website-owned `VeyraPlatformClient`; it does not consume the Platform SDK/contracts package.
- Platform: npm workspaces, Fastify 5 API, Zod contracts, Supabase-backed services, and a shared SDK package. Website endpoints observed include pricing, usage, payment history, device, subscription, notification and admin API families. `GET /api/v1/usage` and `GET /api/v1/payments/history` are registered and are consumed by Website pages; older Website documentation claiming they were absent is stale.
- Desktop: Electron 39, Vite, React 19, SQLite/Drizzle and local inference/voice dependencies. Existing source contains interview, document, context, provider and overlay implementations. A separate Express `server/` contains account/device/billing/AI route scaffolding; source search did not establish that this server is integrated into Electron startup. No Platform SDK import was found in the inspected client sources.
- Development ports: Website 5173, Platform 3000, Desktop renderer moved from 5173 to 5174 in its Vite and Electron dev URL references to remove the collision.

## Website changes in this checkout

- Corrected the Website fallback URL to `http://localhost:5173` while retaining Platform API port 3000.
- Fixed absolute same-origin redirect validation and added regression coverage.
- Removed a fabricated zero-dollar dashboard credit display when Platform data is unavailable.
- Revised marketing and live-assistant copy to state that live capture requires the Desktop app, permissions and explicit activation; static screens are labelled as illustrative.
- Removed the contact form's simulated delay and false “message sent” success. The page now states that message submission is not configured.
- Hardened password reset UX to require a Supabase recovery session and show expired/invalid-link states. Website recovery requests now send the configured Website Origin.
- Added reduced-motion CSS and baseline response headers for content-type sniffing, framing, referrer policy and camera/microphone/geolocation permissions.
- Added Website integration and design-system documentation and superseded stale integration/security statements in existing Website reports.

## Verification

- Website: `pnpm run typecheck` passed; `pnpm test` passed 6 files / 22 tests; production `pnpm run build` completed, generated 40 static pages, and listed static and dynamic routes. A second production build is in progress after adding response headers.
- Platform: API/contracts/SDK `npm run typecheck` passed. API tests passed 17 files / 120 tests. The root workspace test command failed because `packages/contracts` has no test files (the SDK also has no tests configured with actual test files). Initial build was blocked by sandbox `EPERM` when writing `apps/api/dist`; an escalated build is running. Startup/readiness has not yet been runtime-verified.
- Desktop: `pnpm run typecheck` initially encountered an access-denied pnpm store lock. An escalated `pnpm exec tsc -b --pretty false` is running, but pnpm is downloading dependencies including large ONNX runtime packages; no result is yet verified. Desktop tests/build and overlay behavior have not been verified.
- Cross-project signup/payment/device/revocation/usage/release/deletion flows were not run against a test environment. Provider credentials and external service configuration are not assumed to work from environment variable presence alone.

## Security and integration findings

- Platform currently has mock payment, email and storage providers in local configuration; do not treat mock checkout/webhook behavior as production payment verification.
- Google OAuth credentials are present in local configuration and GitHub credentials were not present, but OAuth provider activation/callback was not runtime tested. No credential values are included here.
- Initial discovery found Website password recovery depended on an unvalidated incoming Origin. Platform now checks against configured `ALLOWED_ORIGINS`; the external reset-email callback still needs end-to-end verification.
- Website access tokens are stored in a JavaScript-readable cookie in the existing auth implementation. Response headers were added, but no CSP was configured; an XSS defense-in-depth review remains necessary.
- Pricing, credits, subscription and authorization logic remain Platform responsibilities. The Website must continue to display unavailable/error states rather than derive or fabricate these values.

## Git and delivery status

The Website checkout has no `.git` directory, so branch/remotes, commits and push cannot be performed from this checkout. Desktop and Platform have existing user changes; they were not staged or committed. No push was performed. Repository-level commit and integration delivery therefore remain incomplete.

## Remaining work / exact blockers

1. Complete and verify Platform build and actual loopback startup/readiness; fix any reproduced defect.
2. Complete Desktop dependency installation, typecheck, test and build; inspect the overlay and Platform wiring before integration claims.
3. Harden Platform password-recovery redirect origins and verify Website ↔ Platform OAuth/session refresh end to end.
4. Add actual tests for contracts and SDK packages or adjust their test scripts so workspace tests have truthful results.
5. Verify server-side ownership, entitlement/device revocation, payment webhook, usage ledger and release asset integrity paths against safe test data.
6. Review all Markdown in Desktop and Platform; the broad audit remains incomplete and historical reports are not accepted as proof.
7. Create the required Platform and Desktop documents in their respective writable repositories, and complete the Website baseline audit with final verification evidence.
8. Provide a Git-backed Website checkout and authorized filesystem access to Desktop/Platform to complete coherent commits and safe pushes.

No claim is made that all 25 completion criteria have been satisfied.
## Final verification update (2026-11-15)

- Website after the last marketing/motion fixes: typecheck passed, Vitest passed 6 files / 22 tests, and production build passed after the security-header configuration (40 generated pages).
- Desktop TypeScript build mode passed via direct compiler invocation. A full Desktop Vitest run was started but produced no test progress for approximately 50 seconds and was interrupted; no pass/fail claim is made. The prior pnpm command reported blocked lifecycle scripts for Electron and ONNX dependencies; Desktop package build and runtime remain unverified.
- The Platform production build and TypeScript checks both passed. Startup remains unverified because its current listener binds all interfaces; a loopback-only startup check was not performed.
- The Platform workspace test script still exits nonzero at `packages/contracts` because no tests are present there, despite 120 passing tests in the API workspace.

## Additional Platform integration work

- Hardened password recovery: Platform now permits a reset redirect only when the request origin exactly matches a configured `ALLOWED_ORIGINS` origin. Missing or invalid origins return the same enumeration-safe success response without sending a reset email. Added four focused tests.
- Platform TypeScript check passes; API suite passes 18 files / 124 tests; production build passes after the recovery helper change.
- Platform started on loopback port 3127 with the configured mock providers. `/api/v1/health` and `/api/v1/ready` both returned `ok`, then the server was stopped. This verifies startup and process readiness only.
- Added the requested Platform and Desktop architecture/integration/security/operations/status snapshots in their respective repositories. They clearly mark runtime and integration checks that remain incomplete.- Desktop renderer production build passed with Vite: 1,651 modules transformed; output bundle 466.07 kB (135.43 kB gzip). This does not verify Electron packaging or native modules.- Website navigation now separates mobile and account-menu state, exposes `aria-expanded`/`aria-controls`, and disables entrance/exit motion for reduced-motion users. Final post-change typecheck, 22 tests and production build pass.
- Documentation inventory found 40 Markdown files in Desktop, 41 in Platform and 10 in Website. The audit reviewed representative architecture/security/integration docs and source, not every Markdown file; exhaustive review remains open.

## UI-first implementation update (2026-11-15)

- Visually inspected the supplied 1536×1024 reference image and extracted the nine requested panel crops plus a second detected-state overlay crop under `public/design-references/`. The index maps each crop to its intended screen and warns against copying illustrative prices, counts, and activity.
- Reworked the Website homepage hero into a responsive, light-first Desktop workspace preview with preparation, context, model mode, and explicit capture-off state; added product sections for practice, live Desktop assistance, and local/cloud choices. Preview content is labeled illustrative.
- Added a split-screen premium auth layout and reused it for login/registration. Google and GitHub buttons now use provider marks, query Platform provider availability, and submit through the existing OAuth Server Action only when the provider is configured. These external provider flows remain unverified.
- Aligned Website auth routes to the actual App Router paths (`/login`, `/register`, `/callback`, `/forgot-password`, `/reset-password`) and corrected both the Website OAuth-state cookie path and Platform recovery redirect path to `/callback` and `/reset-password`, respectively. Platform recovery origin allowlisting has focused test coverage; the email callback was not sent end to end.
- Desktop received targeted light-first shell, navigation, dashboard, and dark-glass overlay styling while preserving existing logic. Renderer TypeScript check and Vite production build passed (1,651 modules; 468.98 kB JS, 136.19 kB gzip). The full Vitest suite passed 57 files / 319 tests. Electron packaging/runtime and OS-level overlay/capture remain unverified.
- Website verification after these changes: typecheck passed; 6 test files / 22 tests passed; Next production build compiled, typechecked, generated all 40 static pages, and completed successfully.
- Platform focused recovery tests passed 4/4 and API typecheck passed. The full API suite initially timed out one payment reconciliation role test under concurrent project builds; that test passed in isolation, and a complete rerun passed 18 files / 124 tests. Existing duplicate-key warnings remain in payment test fixtures.
- Platform startup/readiness was verified both on the earlier isolated loopback run and on intended port 3000. The final `npm run dev` invocation logged `server listening` on port 3000; `/api/v1/health` and `/api/v1/ready` returned `ok`. Real Supabase/OAuth/payment configuration and cross-client purchase/device/usage/release/account lifecycle remain unverified.

## Current limits and delivery

- Visual work is partial: the Website marketing home and auth screens plus Desktop shell/dashboard/overlay surfaces were improved; every public, customer portal, admin, practice, assessment, model-management, and live-interaction screen has not been redesigned or runtime-inspected.
- Website has no `.git` metadata. Desktop and Platform contain existing unrelated changes. No files were staged, no commits were created, and nothing was pushed.
- The work remains an in-progress implementation; the remaining end-to-end integrations, full responsive visual QA, exhaustive documentation review, and Desktop Electron runtime/package tests are required before production acceptance.

## Final verification correction

- Desktop dashboard fallback copy was cleaned up after renderer inspection. The final Desktop TypeScript build mode passed and the final Vite renderer build passed (1,651 modules; 468.98 kB JS, 136.19 kB gzip).
- Desktop Vitest passed 57 files / 319 tests.
- Platform's complete API suite rerun passed 18 files / 124 tests; the previously timed-out test passed in isolation. Platform API typecheck passed.
- Platform started through the existing root `npm run dev` script on 127.0.0.1:3000 and both health/readiness endpoints returned `ok`; the process was stopped after verification.
- Website Next production build completed successfully after generating 40 static pages; Website typecheck and 22/22 tests passed.
- The crop references are present at `public/design-references/`. They are visual-only source crops; the product mockup in the Website hero remains explicitly illustrative.
- Runtime visual check: built Website returned HTTP 200 on loopback port 5180. Edge/Playwright rendered desktop 1440px and mobile 390px home screenshots with no page errors and no horizontal overflow. The initial capture was taken before the hero entrance completed; the post-animation screenshot showed the complete hero and mock overlay. This was a homepage visual check, not full breakpoint-by-breakpoint or portal QA.
- Pricing preview no longer displays a permanent fake loading card or disabled sales action. The `/pricing` page loads Platform's public regional plan endpoint for guests, defaults to a Platform-configured supported region, lets customers select a supported region/currency, and still uses authenticated Platform detection when signed in. The endpoint/client change passes Website typecheck/tests/build; live configured price records were not available for end-to-end verification.
