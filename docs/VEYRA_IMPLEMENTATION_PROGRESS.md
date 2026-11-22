# VEYRA implementation progress

Updated: 2026-11-21 (Africa/Johannesburg)

## Current position

- Workspace paths verified: `Veyra`, `veyra-website`, `veyra-platform`, and `VEYRA-DESIGN-SPECS` all exist. The expected nested `VEYRA-FIGMA-PRODUCTION-GENERATOR` directory does not; the source package is directly in `VEYRA-DESIGN-SPECS`.
- Website: branch `feat/veyra-design-foundation`; docs milestone `4c289f5` (`docs: track desktop design implementation milestone`) pushed to its new matching origin branch. Existing user change preserved in `docs/ECOSYSTEM_BASELINE_AUDIT.md`.
- Desktop: branch `feat/veyra-phases-12-22`; implementation milestone `61d2cf8` (`feat(desktop): align overview with VEYRA design`) pushed to the existing matching origin branch. Existing user changes in `package.json`, `docs/CREDENTIAL_ROTATION_GUIDANCE.md`, and `scripts/check-secrets.js` remain unstaged and preserved. The existing primary token `#6b4fe0` was retained because it matches the reference brand color.
- Platform: branch `phase-2/supabase-foundation`; HEAD `2d60eca`, clean at last inspection.
- Design source reports 119 generated manifest screens across 17 pages and 19 sections, 84 distinct screen-builder bodies, 30 Live Copilot overlay states, 21 component families and 57 variants. The 119 count includes state variants and is not evidence that all product requirements are designed.
- The source package says frames were never visually reviewed in Figma, per-screen written specifications (W-08) are unfinished, and multiple marketing, legal, authentication, billing, portal, install, onboarding, provider/model, desktop settings, practice and admin states have no frames. Prototype/sample commercial, provider, model, legal and candidate data must not be used as production truth.
- Website remains Next.js 15 App Router with Supabase auth and existing Platform clients/actions. Desktop is Electron main/preload plus Vite/React renderer, shared contracts and local services. Platform is the authoritative Fastify API/SDK/contracts and Supabase persistence layer. Preserve these boundaries.

## Completed in prior milestone

- Website exact palette/spacing/radius token layer, semantic Tailwind values, Header and Button alignment; fixed pricing JSX and nullable exchange-rate defects and duplicate platform client methods.
- Website `npm run typecheck` and `npm run build` passed (42 static pages at that milestone).
- Master plan, architecture map, 119-entry coverage matrix, human/machine design-reference maps, visual QA report and Figma handoff created.

## Completed in this continuation

- Rechecked the three repository states and preserved all pre-existing user changes.
- Compared desktop app shell and overview source with the existing renderer. Updated desktop theme tokens to the exact source palette, spacing/radius aliases, sidebar width (236px), active navigation colors, and top bar height (56px); removed app-level gradients not present in the reference shell.
- Reworked the desktop overview to the source hierarchy (status row, Live Copilot and Practice Studio panels, recent sessions table), using existing provider, hardware assessment and practice IPC. Added explicit loading, empty and unavailable states; navigation uses existing routes and capture remains user initiated.
- Fixed a verified packaging/preview defect: Vite had no `publicDir` configured despite assets being kept under `client/public`, so requests returned the SPA HTML fallback. Configured the existing asset directory, added the supplied symbol mark to the sidebar, and aligned browser theme color metadata.
- Captured and inspected implementation screenshots at 1280x900 and 390x900. Confirmed actual IPC control flow using explicit browser stubs, no page errors, image natural width 157 after public-directory correction, and Start Live Copilot navigates to `/live`. These are renderer checks with stubbed IPC, not real hardware/backend verification.
- Desktop `npm run typecheck`, `npm run build`, and user-added `npm run veyra:secret:check` passed. Vite emitted the existing >500kB chunk warning; build completed successfully.
- Began website marketing phase 06 with the homepage hero. It now follows the `homePage` builder's copy, layout hierarchy, 54px/60px desktop type, 32px/40px narrow type, exact brand palette, CTA destinations and light Live Copilot overlay preview. Removed hero-only GSAP animation and converted the section file to server-renderable components.
- Website `npm run typecheck` and `npm run build` passed after the hero changes; Next generated 42 pages. Captured and inspected production renders at 1440px and 390px, with no browser page errors. The hero download link resolves to `/download`; 834px and the lower homepage sections still need visual review.
- Aligned the homepage “How it works” section with the source `homePage` builder: four steps, matching copy and icon family, source spacing, and desktop four-column/narrow stacked layout. Removed the client-only viewport reveal animation, which left this content hidden in static full-page captures, and moved the section directly after the hero. The resulting homepage route is again server-renderable for this section.
- Website production build passed after both homepage changes and generated all 42 routes. Verified the four step headings at 1440px and 390px; no browser page errors occurred.
- Made the FAQ category tabs, question search, expandable answers, and no-results state interactive in a focused client component. Retained the existing contact path and used only current product statements; added a local-model FAQ grounded in the Desktop hardware assessment and runtime recommendation flow.
- Website `npm run typecheck` and ESLint over `src` passed after the FAQ changes. `git diff --check` passed.
- Added focused FAQ interaction tests, but Vitest could not start either a fork or a single-thread worker (both timed out before test collection); no Vitest assertions ran.
- Built all 42 Website routes successfully using a separate temporary Next output directory. The incremental rebuild reported a Webpack cache `EPERM` rename warning but exited successfully.
- Verified the production `/faq` route returned HTTP 200 and manually exercised category switching, answer collapse, search matching, and the empty-results state in the browser. At 1440x900 and 390x844, the document did not overflow; the narrow category group wraps and has no internal horizontal overflow. Screenshots were inspected in the integrated browser but not saved to files.
- The pre-existing development server still emitted `invariant expected layout router to be mounted`; its generated `next-env.d.ts` reference pointed at `.next` while `next.config.mjs` selects `.next-dev` for development. Restored the initially clean `.next-dev` reference. The cause of that dev-server mismatch remains unisolated; production build/browser verification passed.
- On continuation, `npm run typecheck` and the full Next.js production build passed with all 42 routes generated; a production `GET /faq` returned HTTP 200. A focused Vitest rerun (`--pool=threads --maxWorkers=1`) again timed out before test collection with `Failed to start threads worker`; no FAQ assertions ran. The dev router error and actual browser interaction/hydration remain unresolved. An automated Chrome screenshot launch was rejected by the environment policy, so no new visual screenshot is claimed.
- Ran a separate Next.js dev server on port 5182 with `VEYRA_NEXT_DIST_DIR=.next-dev`: `/faq` compiled and returned HTTP 200 in 61 seconds, with no server-side router error in the dev log. This does not verify client hydration or reproduce the integrated browser error. The server was stopped after the request.
- Confirmed the Platform release-list endpoint requires an authenticated user and is marked as an admin operation. The public download page was left unchanged rather than exposing privileged release metadata; verified installer publication remains an external/platform blocker.
- The user explicitly selected the design package's proposed VEYRA mark for this implementation. The Website header and Desktop sidebar use the supplied symbol; the Website favicon and Desktop onboarding use the supplied app icon. SHA-256 checks confirmed the copied SVGs match the design-package assets exactly. This selection does not change the package's status of the identity as proposed v0.2.
- Rebuilt the Website homepage hero preview from the source `demoFrame` and `overlayPanel('answer')` structure. The preview stays static, labels sample content as non-candidate data, and shows microphone and screen capture off. Increased the narrow preview frame to 420px; direct layout measurements show 15.1px clearance at 390px and 7.1px at 834px and 1440px.
- Rechecked responsive layout at 390px, 834px and 1440px after reloading at each viewport. Document scroll width matched the available client width at all three sizes. The 390px browser screenshot was visually inspected; current browser captures were not persisted as image files. No rendered Figma frame was available for comparison.
- Final cleanup: stopped the owned preview servers on ports 5183 and 5184; Website and Desktop `git diff --check` passed. No commit or push was made, and the Platform repository remains unchanged.

## Website phase 06 checkpoint

- Current phase: Website phase 06, public marketing. The homepage, navigation and footer slice is implemented; the wider website remains incomplete.
- Completed: aligned the responsive header/footer to the source navigation groups; added Product and Resources dropdowns, a mobile menu, working feature anchors and preserved existing account actions. Rebuilt the homepage around the source hero, four-step flow, Live Copilot, evidence labels, qualified processing options and closing CTA.
- Added the source-defined `WM-02` Live Copilot page at `/live-copilot`, with illustrative idle/listening/question/answer states, capture controls, app backdrops and linked CTAs. Header, footer and Features entry points now route to the dedicated page.
- Reworked `/privacy` against `privacyPage`: illustrative capture-state labels, a data-handling summary, desktop table/mobile cards, the existing account/authentication details, and an explicit legal-review disclaimer. Removed the unsupported future “Last updated” date; did not add certification or compliance claims.
- Rebuilt `/download` against `downloadPage`; the installer remains unavailable until a verified public release asset exists. Added `/ai-configuration` from `aiConfigPage` and linked it from Product navigation, Features and the footer.
- Rebuilt `/pricing` against `pricingPage`: live Platform offers, monthly/annual selection, regional prices, explicit unavailable and stale-cache states, and existing authenticated checkout. Did not copy placeholder plan names/prices/allowances or expose admin-only release data. Public offer response currently omits feature limits, so the page says so instead of inventing a comparison.
- Pricing also fixes currency conversion display and normalizes raw network errors through the existing Platform error helper. Checkout still redirects unauthenticated users to sign-in and only uses verified live offers.
- Accuracy and privacy: preview content is explicitly illustrative, with microphone and screen capture shown off. Processing options remain qualified by account, release and hardware. Fixed the closing secondary CTA so its white text sits on a translucent dark surface.
- Files in this slice also include `src/app/(marketing)/download/page.tsx`, `src/app/(marketing)/ai-configuration/page.tsx`, and `src/app/(marketing)/pricing/page.tsx`. Existing FAQ work remains separate.
- Validation: Website `npm run lint`, `npm run typecheck`, and isolated production `npm run build` passed; the build generated 44 routes including `/pricing` and `/ai-configuration`. Browser checks exercised the unavailable-pricing state, annual-toggle state, and pricing/navigation links. Live plan display and checkout could not be verified because the configured Platform API at `localhost:3000` was unavailable.
- Visual QA: the new/updated pages were checked at 1440, 1024, 768 and 390px; document width matched the viewport's client width at each size. Screenshots were inspected in the integrated browser but not persisted. The Live Copilot preview remains labelled illustrative/non-capturing. This is source-builder and implementation-render verification, not Figma-render comparison.
- Incomplete / known issues: remaining public pages, authentication, customer portal and billing/account screens still need reconciliation. Port 5174 is a responsive Veyra Vite page (HTTP 200) and was left running; no listener was present on 5173 when checked, so the earlier Next runtime issue was not reproduced. No Electron process was found by the targeted process-name check. The temporary Website preview on 5193 was stopped. FAQ tests previously timed out before collection, so no FAQ test assertions ran.
- External blockers: verified public release metadata remains unavailable through the admin-only release-list endpoint. No commit or push was made; concurrent worktree changes were preserved.
- Exact next action: continue customer account, billing, and portal journeys against verified Platform contracts, then resume the Desktop candidate-context flow without disturbing the live Vite process.

## Next actions

1. Keep the Website dev server at port 51730; the cold Next.js compile is slow but the homepage, About, and Pricing now return successfully. Investigate the duplicated FAQ tab test separately.
2. Continue reconciling remaining public and account routes. Homepage, About, Live Copilot, Privacy, Download, AI configuration, and live Pricing have been checked. Do not expose admin-only release data.
3. Continue the design gap audit and add missing-requirement rows to the coverage matrix; distinguish generated designs from proposed extensions.
4. Continue implementing/connecting desktop candidate context, documents, Live Copilot, Practice Studio and settings against existing IPC, with a screen-group screenshot and interaction loop per milestone.
5. Map remaining Platform admin UI calls to server-side authorization and service contracts; release listing now has an explicit admin-role check.
6. Resolve narrow-screen detail/table behavior from the actual design patterns and capture relevant responsive states.
7. Update the visual QA and implementation handoff after each milestone. A source-builder comparison or implementation screenshot must not be described as a rendered Figma comparison.
8. Review diffs and commit only explicit task-owned files after final checks. Do not include the existing user changes listed above. Do not push unless branch/remote state is rechecked and the reviewed milestone is safe to publish.

## Screenshot evidence

- Desktop overview 1280x900: `C:\tmp\veyra-ui-baseline\dashboard-desktop-final.png`
- Desktop overview at 390px viewport (full-page capture): `C:\tmp\veyra-ui-baseline\dashboard-mobile-final.png`
- Desktop sidebar branding at 1280px: `C:\tmp\veyra-ui-baseline\desktop-brand-sidebar-1280.png`
- Desktop onboarding branding at 1280px: `C:\tmp\veyra-ui-baseline\desktop-onboarding-brand-1280.png`
- Website homepage captures listed below predate the final brand/hero update and are not current visual evidence: `C:\tmp\veyra-ui-baseline\website-home-1440-final.png`, `C:\tmp\veyra-ui-baseline\website-home-390-final.png`
- Website “How it works” at 1440px viewport: `C:\tmp\veyra-ui-baseline\website-howitworks-desktop-viewport.png`
- Website “How it works” at 390px viewport: `C:\tmp\veyra-ui-baseline\website-howitworks-mobile-viewport.png`
- Earlier onboarding baseline: `C:\tmp\veyra-ui-baseline\onboarding-desktop.png` (not yet compared in this continuation)

## Known limits

- No real Figma frame render was available or inspected; the design generator reports that no frame has yet been reviewed in Figma. This milestone was checked against source builder structure and exact source tokens, plus actual app screenshots.
- Renderer QA used stubbed IPC and does not establish production provider readiness, OS permission state, network connectivity or persisted session correctness.
- Website/platform functional integration and the remaining desktop screens are not complete. No release readiness claim is made.

## Latest continuation: local Website and Platform releases

- Website local configuration now uses port `51730` for Next dev/start, the default app URL, and the trusted local redirect origin. The local Platform CORS configuration allows `http://localhost:51730`; prior origins remain configured.
- The Website dev server is still running at `http://localhost:51730`. The integrated browser verified the homepage, About, and Pricing; About survived a reload. Pricing displayed the live Platform offer, not sample pricing. The first cold Next compilation took about two minutes; subsequent routes returned normally.
- Platform API health/readiness and the Website homepage/Pricing returned HTTP 200. The pricing endpoint returned `source: live` and a database-backed VEYRA Cloud AI monthly offer for NG, with checkout availability reported by the API.
- Platform release checks now enforce SemVer ordering, stable per-user rollout cohorts, and an installer-asset requirement. Missing channels return no update only for the expected no-row error; other query errors propagate. The release-list route now checks the admin role before querying with the service client.
- Validation: Platform API suite passed (23 files, 169 tests); release-focused tests passed (14 tests); API/contracts typechecks passed. Website typecheck and lint passed, and the redirect-origin test passed (6 tests). The full Website suite passed 25/26 tests; the existing marketing FAQ test finds duplicate “Billing” tabs after rendering the component twice. The Platform lint script remains unusable because its ESLint 9 config is empty and ignores `src`/`test`.
- No migrations, commits, or pushes were made. Website account/billing portal and Desktop milestones remain incomplete; Platform phase 9 remains in progress pending signed-metadata and end-to-end updater verification.

## Latest continuation: Desktop Live Copilot overlay

- Redesigned `Veyra/client/src/features/overlay/CopilotOverlay.tsx` against `dev/src/50_overlay.js::overlayPanel` and the registered 300/380/520px overlay sizes. Replaced the dark gradient card with the 80%-white, 24px-blurred panel, light status chips, compact header controls, provenance-labeled guidance and a manual question entry state.
- Preserved the existing runtime and overlay preload calls. Added real window resizing through the existing `setSize` API for compact/expanded and size selection; opacity, always-on-top, pause/resume, complete and hide actions remain connected. The overlay clearly reports that its own microphone and screen capture are off and live transcription is not connected.
- The overlay now overrides the global 320px page minimum to support the existing 280px Electron minimum and the design's 300px small variant while mounted.
- Verified Desktop `npm run typecheck` and `npm run build:client`; both passed. The pre-existing 527–529 kB client bundle warning remains.
- Used Playwright against the existing Vite preview with an explicit mocked preload bridge. At 420×360 and 300×360, the light panel rendered with no page errors or horizontal overflow. Exercised 520px expansion, 300px size selection, typed question/guidance, pause/resume, complete and hide calls. Captures inspected: `C:\tmp\veyra-ui-baseline\desktop-overlay-light-420-final.png` and `C:\tmp\veyra-ui-baseline\desktop-overlay-light-300-final.png`.
- Native Electron window sizing, OS permission grants, microphone capture, transcription and real provider readiness were not tested by the renderer stub. The supplied source's remaining 30 overlay states are not yet fully represented or verified. No commit or push was made; onboarding and other pre-existing Desktop changes were left untouched.

## Latest continuation: Desktop Practice Studio and candidate profile

- Rebuilt `client/src/pages/Preparation/QuestionPractice.tsx` against `dev/src/43_app.js::practiceHome`, `practiceSetup`, `practiceSession` and `practiceReport`. The setup, written answer flow, pause/resume, completion, feedback and recent sessions use the existing practice API. Voice is explicitly unavailable in this flow; answer quality/score content is only shown when returned by the existing service.
- Rebuilt `client/src/pages/Profile/Profile.tsx` against `profilePage` with a saved-profile overview, completeness derived from saved profile/record sections, missing-information checklist, candidate record counts, education and certification summaries, workspace switching/creation, and editable profile details through the existing candidate IPC. Added `client/src/pages/Profile/Profile.css` to stabilize the responsive profile overview after rendered QA exposed an unsupported width utility.
- Rebuilt `client/src/pages/Documents/Documents.tsx` against the `documentsPage` source and existing document IPC. Import supports the currently wired TXT/Markdown/HTML/PDF/DOCX parser paths, shows actual processing failures, supports live search and processed/attention filters, opens stored extracted text and parser warnings, and deletes through the existing indexed-data cleanup operation. Added `client/src/pages/Documents/Documents.css` for a stable responsive search field. The detail dialog uses explicit viewport positioning because the Vite/Tailwind dev preview did not emit a newly added inset utility; no new renderer-to-filesystem access was added.
- Verified Practice Studio at 1440px setup/session and 390px setup; no horizontal overflow or renderer errors. The answer session, progression, pause/resume and completion were exercised earlier with explicit mocked preload responses. Captures: `C:\tmp\veyra-ui-baseline\desktop-practice-setup-1440.png`, `desktop-practice-session-1440.png`, `desktop-practice-setup-390.png`.
- Verified candidate profile at 1440px and 390px with a mocked candidate store: no horizontal overflow or renderer errors. Rechecked the profile overview after fixing a squeezed desktop layout. Exercise of profile edit/save confirmed the existing API received the updated headline and the UI showed its saved status. Captures: `C:\tmp\veyra-ui-baseline\desktop-profile-1440.png`, `desktop-profile-mobile-390.png`.
- Verified Documents at 1440px and 390px with a mocked document store: no renderer errors or horizontal overflow; import, stored-text open/close and status filtering behaved as intended. Captures: `C:\tmp\veyra-ui-baseline\desktop-documents-1440.png`, `desktop-documents-mobile-390.png`, `documents-dialog-mobile.png`. IPC stubs do not verify real file parsing, database persistence or candidate evidence association.
- Renderer checks: Desktop `npm run typecheck`, `npm run build:client`, and `git diff --check` passed before the last explicit dialog text-wrap styling change; run one final check before handoff. The existing client bundle warning above 500 kB remains. Browser checks used mocked preload APIs and do not establish live Electron, database, AI feedback, document processing or native permission behavior.
- Files changed by this continuation: `client/src/features/overlay/CopilotOverlay.tsx`, `client/src/pages/Preparation/QuestionPractice.tsx`, `client/src/pages/Profile/Profile.tsx`, `client/src/pages/Profile/Profile.css`, `client/src/pages/Documents/Documents.tsx`, and `client/src/pages/Documents/Documents.css`. Existing user onboarding, branding, routing and security-check changes were preserved. Task-owned files were committed as `2a4eb74` (`feat(desktop): redesign practice and candidate workspace`) and pushed to `origin/feat/veyra-phases-12-22`; unrelated Desktop worktree changes remain uncommitted.
- Exact next action: continue Candidate Context by aligning the Experience, Skills and Stories screens to their supplied builder patterns and existing candidate-record IPC. Keep the live Vite process at port 5174 running.


## Latest continuation: Desktop remaining screens & Platform Admin UI

- **Desktop Session History & Reports (`client/src/pages/History/History.tsx` & `SessionDetails.tsx`)**:
  - Rebuilt `History.tsx` against `dev/src/43_app.js::sessionHistory`.
  - Replaced legacy dark zinc styling with light VEYRA design tokens (`#F4F5FA` page surface, `#FFFFFF` cards, `#E2E5EF` borders, `#6b4fe0` brand accents).
  - Implemented interactive tab switching (All / Live Copilot / Practice Studio), live query search across session titles, roles, and domains, and status badges (Ready/Incomplete/Saved).
  - Rebuilt `SessionDetails.tsx` with structured Configuration/Progress and Evaluation/Report cards, strengths/weaknesses breakdowns, and direct practice launch links.
- **Desktop Interview Pre-Flight Setup (`client/src/pages/InterviewSetup/InterviewSetup.tsx`)**:
  - Rebuilt against `dev/src/43_app.js::practiceSetup`.
  - Added interactive mode switcher (Practice Studio vs. Live Copilot) and interview type selection (Behavioural / Technical / Case study).
  - Added role and industry domain selection, difficulty segments (Warm-up, Standard, Challenging), question count selector, and hardware/runtime readiness check cards.
  - Preserved existing Unified Interview Runtime preload IPC calls and session navigation.
- **Desktop Candidate Context — Experience, Skills, Projects (`client/src/pages/Profile/Experience.tsx`, `Skills.tsx`, `Projects.tsx`)**:
  - Rebuilt all three screens to match VEYRA light design tokens, removing all legacy dark zinc and `bg-black/20` styles.
  - `Experience.tsx`: added inline editor modal, confirmed badges, company/location/date metadata, technology tags, and key achievement bullet points.
  - `Skills.tsx`: redesigned with verified status badges, proficiency chips, years of experience, and category filtering.
  - `Projects.tsx`: redesigned with rich project cards, outcomes and impact lists, external repository and live demo links, and modal editing.
- **Desktop Settings & Providers (`client/src/pages/Settings/Settings.tsx`)**:
  - Redesigned provider credential configuration, local-only vs cloud execution mode cards, health checking, and model catalogue selection with VEYRA light styling and OS-encryption security guidance.
- **Desktop Contract & Typecheck Resolution**:
  - Resolved `LiveInterview.tsx` preload API contract alignment: corrected `audio.startSession` to `{}` and `audio.stopSession` to `{ sessionId }`, and safely resolved `window.veyra.capture`.
  - Verified `npm run typecheck` in `C:\Users\MATTHEW\Desktop\Veyra`: exited with code 0.
  - Verified `npm run build:client` in `C:\Users\MATTHEW\Desktop\Veyra`: Vite production build built in 26.63s with code 0.
- **Platform Admin UI (`veyra-website/src/app/admin/`)**:
  - `admin/page.tsx` (System Overview): redesigned with KPI summary cards (Total users, Active subscriptions, Total subscriptions, Credits issued), service operational status table, and quick access navigation cards.
  - `admin/users/page.tsx`: redesigned with status filter chips (All / Active / Pending / Restricted), live search by name/email/ID, user table with status badges and timestamps, pagination, and server-authorization notices.
  - `admin/users/[userId]/page.tsx`: redesigned with full profile overview, subscription and renewal details, assigned role badges, and audit event reminders.
  - `admin/audit/page.tsx`: redesigned against `dev/src/44_admin.js::adminAudit` with action category filters, search box, timestamped audit events table, and slide-in JSON metadata details drawer.
  - `admin/payments/page.tsx`: connected to `c.adminListPayments()`, rendering real transaction ledger with amount, currency, formatted date, and status badges.
  - `admin/devices/page.tsx`: implemented device session lookup and revocation form calling `c.adminRevokeDevice()`, with audit reason capture.
  - `admin/subscriptions/page.tsx`: redesigned with per-user subscription lookup calling `c.adminGetSubscription()`, active plan details, and auto-renewal inspection.
  - `admin/health/page.tsx`: implemented 24-day uptime visualization grid per subsystem.
  - Verified `npm run typecheck` in `C:\Users\MATTHEW\Desktop\veyra-website`: passed with code 0.

## Latest Milestone: Desktop Permissions, Notifications, Overlay & Distribution Hardening (2026-11-22)

- **Desktop Notification Center & TopBar (`client/src/stores/notificationStore.ts`, `components/notifications/NotificationCenter.tsx`, `components/layout/Header.tsx`)**:
  - Implemented zero-dependency reactive notification store with `useSyncExternalStore` and `localStorage` persistence.
  - Created `NotificationCenter` flyout dialog featuring unread counter, status badge, notification categories (system, permission, update, session), severity indicators, mark-as-read, clear-all, and actionable deep-links.
  - Aligned desktop `Header.tsx` to `dev/src/30_shells.js`: live search field (`Search sessions, documents…`), operating mode badge, provider health badge, "New practice" primary CTA, notification flyout toggle, and user avatar pill.
- **Desktop Permission Centre (`client/src/pages/Settings/PermissionsSettings.tsx`)**:
  - Rebuilt complete permission management matching `dev/src/42_onboarding.js::permissionCentre`.
  - Added dedicated panels and state inspection for all 4 core permissions:
    1. Microphone (voice interview capture, "Why we ask" explainer modal, 3-step OS fix guide, IPC permission refresh/request).
    2. Screen capture (window-specific context, user-triggered only).
    3. Document access (CV and certificates, local file access only).
    4. Notifications (desktop alerts, test notification trigger).
- **Desktop Overlay Preferences & Updates (`client/src/pages/Settings/OverlaySettings.tsx`, `UpdatesSettings.tsx`, `Settings.tsx`)**:
  - Built `OverlaySettings.tsx` matching `dev/src/43_app.js::settingsOverlay`: opacity slider (50% to 100%), always-on-top toggle, click-through toggle, size segments, 3x3 default position grid, and live preview frame simulating STAR guidance.
  - Built `UpdatesSettings.tsx`: displays current version (`v0.5.0`), target OS (`Windows x64`), release channel selector (`Stable` vs `Beta`), auto-check toggle, update check action, and Cloudflare R2 / SHA256 integrity guidance.
  - Integrated tabbed navigation in `Settings.tsx` with URL search param sync (`?tab=ai`, `?tab=permissions`, `?tab=overlay`, `?tab=updates`).
- **Website Social Preview & Metadata Hardening (`src/app/layout.tsx`, `public/og-card.svg`, `admin/layout.tsx`, `dashboard/layout.tsx`)**:
  - Designed and added official OpenGraph social sharing card `public/og-card.svg` (1200x630) with VEYRA brand identity, live copilot overlay preview, and feature tags.
  - Configured complete OpenGraph and Twitter card metadata with canonical URL and GoogleBot indexing rules in `src/app/layout.tsx`.
  - Added `robots: { index: false, follow: false }` to `/admin/layout.tsx` and `/dashboard/layout.tsx` to prevent search engine indexing of private admin and customer portal routes.
- **Deployment and Distribution Architecture Documentation (`docs/DEPLOYMENT_AND_RELEASE_ARCHITECTURE.md`)**:
  - Authored comprehensive guide covering multi-app ecosystem deployment (Vercel, Render, Supabase, Cloudflare R2), R2 release bucket layout, and production credentials checklist without exposing secrets.
- **Verification**:
  - Desktop `npm run typecheck`: passed with code 0.
  - Desktop `npm run build:client`: Vite production build passed in 36.68s with code 0.
  - Desktop `git diff --check`: passed with zero formatting or whitespace errors.
  - Website `npm run typecheck`: passed with code 0.
