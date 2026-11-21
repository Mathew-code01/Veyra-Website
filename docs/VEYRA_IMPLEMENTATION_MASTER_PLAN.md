# VEYRA implementation master plan

This plan covers the three existing repositories and the shared design specification. All three application repositories are available for implementation. Preserve existing local changes in each repository and treat the design package as read-only reference material.

## Phases and acceptance criteria

| Phase | Scope | Acceptance criteria | Status |
|---|---|---|---|
| 00 | Workspace and repository discovery | Verify all paths, branches, remotes, worktree state and app entry points. | Complete for initial discovery; detailed API/IPC tracing continues in phase 03. |
| 01 | Design-package audit | Read handoff, design system, inventory, architecture, flows, token/component/shell/screen/overlay builders, SVGs and manifest; reconcile counts and caveats. | In progress; 119 frames/17 pages/19 sections reconciled, but missing product designs and W-08 per-screen specifications remain. |
| 02 | Screen and route coverage | Create a per-screen comparison across manifest, source, docs and app routes/screens, with honest design/functionality gaps. | In progress; 119 manifest rows exist; requirement-level missing-design rows and detailed mapping remain. |
| 03 | Architecture and integration audit | Map frameworks, entry points, routes, APIs, auth, data, IPC, services and security boundaries across all repos. | In progress; Electron renderer entry, route map, provider/hardware/session IPC, Platform module map and website route/client map recorded; endpoint-by-endpoint tracing remains. |
| 04 | Design tokens and typography | Translate exact source values into the existing design-token implementation; keep unsupported values explicit. | Website foundation and desktop exact palette/spacing/sidebar/header tokens implemented; full typography/screen coverage remains. |
| 05 | Shared component library | Align existing shared components to reference variants and accessible states without replacing the component stack. | In progress; website Button/Header and desktop shell/sidebar use source tokens; remaining variants and states remain. |
| 06 | Website marketing | Implement and connect public pages, responsive navigation, downloads and release information. | In progress; homepage hero is source-aligned and screenshot-checked at 1440px/390px; full page, all public routes, and verified release data remain. |
| 07 | Website authentication | Preserve existing Supabase/OAuth/password recovery flows and align designed states. | Not started. |
| 08 | Pricing, billing and checkout | Use authoritative configured prices and server-verified payment/entitlement state. | Not started. |
| 09 | Customer portal | Connect account, devices, billing, usage, notifications, security and support to existing platform APIs. | Not started. |
| 10 | Desktop install and first launch | Align installer/startup UI to the existing Electron lifecycle and supported packaging. | Not started. |
| 11 | Desktop authentication and onboarding | Preserve browser OAuth handoff and existing onboarding contracts. | Not started. |
| 12 | Hardware, permissions and AI setup | Connect actual hardware, OS permission and provider/model readiness services. | Not started; dashboard consumes existing provider/hardware readiness IPC. |
| 13 | Main desktop app | Align navigation, overview, providers, models, activity and settings to existing stores/services. | In progress; overview implemented and renderer-verified against IPC stubs; remaining app routes pending. |
| 14 | Candidate workspace and documents | Connect profile, stories, sessions and document workflows to existing APIs and storage. | Not started. |
| 15 | Live Copilot | Connect permission-gated capture, transcription, AI execution and overlay state controls. | Not started. |
| 16 | Practice and reports | Connect setup, question/answer capture, persistence, feedback and history. | Not started; overview links to existing practice and history flows. |
| 17 | Platform administration | Align admin screens to server-authorized platform operations. | Not started. |
| 18 | Cross-project integration and QA | Verify API contracts, authorization, responsive behavior, accessibility and rendered screens. | In progress; desktop overview screenshots captured at 1280px and 390px; actual IPC/backend checks remain. |
| 19 | Completeness audit and handoff | Resolve coverage, record remaining external/product blockers and report commits/verification accurately. | Not started. |

## Working rules

- Preserve existing branches, local work and application architecture. Never reset or force-push.
- Do not use prototype sample data as production values. Prices, plans, providers, models, legal copy and demo metrics in the design package are placeholders unless confirmed by the platform.
- Keep camera/microphone/screen capture opt-in and visibly stateful. Keep credentials out of the renderer and browser.
- A phase is complete only after its listed acceptance criteria and relevant verification pass.
- Record visual comparisons only when an actual rendered screenshot was inspected.

## First implementation milestone

The website token foundation and first desktop milestone are complete. The desktop milestone aligned shell tokens, fixed packaged public asset serving, and aligned the overview to its supplied builder while consuming existing desktop IPC. The website homepage hero now follows `dev/src/40_web.js::homePage`, with its existing download/how-it-works routes and illustrative preview retained. The Next production build, type validation, and desktop checks passed. Next, reconcile the rest of the homepage sections to their builder, then continue the marketing/download routes and desktop screen audit.
