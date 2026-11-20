# VEYRA implementation master plan

This plan covers the three existing repositories and the shared design specification. The current execution account can write only `veyra-website`; desktop and platform work is limited to read-only discovery until the workspace permissions change. The design package is reference material and must remain untouched.

## Phases and acceptance criteria

| Phase | Scope | Acceptance criteria | Status |
|---|---|---|---|
| 00 | Workspace and repository discovery | Verify all paths, branches, remotes, worktree state and app entry points. | Complete for initial discovery; detailed API/IPC tracing continues in phase 03. |
| 01 | Design-package audit | Read handoff, design system, inventory, architecture, flows, token/component/shell/screen/overlay builders, SVGs and manifest; reconcile counts and caveats. | In progress; 119 manifest entries verified, exhaustive builder and asset inspection remains. |
| 02 | Screen and route coverage | Create a per-screen comparison across manifest, source, docs and app routes/screens, with honest design/functionality gaps. | In progress; matrix created and to be refined with detailed source tracing. |
| 03 | Architecture and integration audit | Map frameworks, entry points, routes, APIs, auth, data, IPC, services and security boundaries across all repos. | In progress; initial map created. |
| 04 | Design tokens and typography | Translate exact source values into the existing design-token implementation; keep unsupported values explicit. | Website token foundation implemented and production build passed; visual verification and remaining apps pending. |
| 05 | Shared component library | Align existing shared components to reference variants and accessible states without replacing the component stack. | In progress; shared Button variants and global Header measurements/colors aligned. |
| 06 | Website marketing | Implement and connect public pages, responsive navigation, downloads and release information. | Not started. |
| 07 | Website authentication | Preserve existing Supabase/OAuth/password recovery flows and align designed states. | Not started. |
| 08 | Pricing, billing and checkout | Use authoritative configured prices and server-verified payment/entitlement state. | Not started. |
| 09 | Customer portal | Connect account, devices, billing, usage, notifications, security and support to existing platform APIs. | Not started. |
| 10 | Desktop install and first launch | Align installer/startup UI to the existing Electron lifecycle and supported packaging. | Not started; repo is read-only in this execution. |
| 11 | Desktop authentication and onboarding | Preserve browser OAuth handoff and existing onboarding contracts. | Not started; repo is read-only in this execution. |
| 12 | Hardware, permissions and AI setup | Connect actual hardware, OS permission and provider/model readiness services. | Not started; repo is read-only in this execution. |
| 13 | Main desktop app | Align navigation, overview, providers, models, activity and settings to existing stores/services. | Not started; repo is read-only in this execution. |
| 14 | Candidate workspace and documents | Connect profile, stories, sessions and document workflows to existing APIs and storage. | Not started; repo is read-only in this execution. |
| 15 | Live Copilot | Connect permission-gated capture, transcription, AI execution and overlay state controls. | Not started; repo is read-only in this execution. |
| 16 | Practice and reports | Connect setup, question/answer capture, persistence, feedback and history. | Not started; repo is read-only in this execution. |
| 17 | Platform administration | Align admin screens to server-authorized platform operations and audit records. | Not started; repo is read-only in this execution. |
| 18 | Cross-project integration and QA | Verify API contracts, authorization, responsive behavior, accessibility and rendered screens. | Not started. |
| 19 | Completeness audit and handoff | Resolve coverage, record remaining external/product blockers and report commits/verification accurately. | Not started. |

## Working rules

- Preserve existing branches, local work and application architecture. Never reset or force-push.
- Do not use prototype sample data as production values. Prices, plans, providers, models, legal copy and demo metrics in the design package are placeholders unless confirmed by the platform.
- Keep camera/microphone/screen capture opt-in and visibly stateful. Keep credentials out of the renderer and browser.
- A phase is complete only after its listed acceptance criteria and relevant verification pass.
- Record visual comparisons only when an actual rendered screenshot was inspected.

## First implementation milestone

Translate the exact VEYRA palette and spacing/radius tokens into the existing website CSS variables. Then complete the source/route mapping, identify the highest-value reference-aligned public page, implement it using existing components and verified release/API data, and run the website checks. Do not edit the desktop or platform repositories from this workspace.
