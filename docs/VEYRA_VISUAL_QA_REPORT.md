# VEYRA visual QA report

Updated: 2026-11-21 (Africa/Johannesburg)

## Current results

Desktop overview screenshots have been captured and inspected. The design package itself states that generated frames have not been visually reviewed in Figma. The implementation was checked against source-builder structure and exact token measurements, but no rendered design frame was available for side-by-side comparison. Therefore this milestone is implementation-render verified, not Figma-render verified.

## Reference measurements available

- Exact global colors, type sizes/line heights, spacing, radii, button/input dimensions and common component styles are recorded in `VEYRA_DESIGN_REFERENCE_MAP.md` and its JSON companion.
- Screen-specific layout dimensions and builder assignments are indexed in the coverage matrix; inspect the named builder for detailed widths, padding, gap and state content before implementation.
- The inventory explicitly calls out 834px tablet, 390px mobile, 900px compact desktop navigation, and overlay width variants 300/380/520.

## QA log

| Date | Product / screen | Viewport | Screenshot | Comparison | Functional/responsive checks | Result |
|---|---|---|---|---|---|---|
| 2026-11-20 | Website build / route compilation | Build renderer (no visual viewport) | None | Not a visual comparison | Next.js compile, type/lint validation, 42 page generation | Passed; visual QA still pending |
| 2026-11-21 | Desktop / Main application overview (`AO-01`) | 1280x900 | `C:\tmp\veyra-ui-baseline\dashboard-desktop-final.png` | Captured and inspected against `dev/src/43_app.js::overviewPage` hierarchy and shell tokens: four status cards, Live Copilot and Practice Studio panels, recent sessions table; exact palette/sidebar/header measurements used. No prototype screenshot exists for pixel comparison. | Browser ran with explicit IPC stubs; provider, hardware and session data rendered, no page errors, sidebar mark loaded (157px intrinsic width), Start Live Copilot navigated to `/live`. | Renderer check passed; packaged Electron/live services still unverified |
| 2026-11-21 | Desktop / Main application overview (`AO-01`) | 390x900 viewport, full-page capture | `C:\tmp\veyra-ui-baseline\dashboard-mobile-final.png` | Captured and inspected at narrow viewport. Cards stack, compact bottom navigation is visible, table retains horizontal scrolling. Fixed navigation overlays the viewport as expected; full-page capture includes the fixed bar at its capture position. | Heading, status cards and session data render without browser errors; route navigation checked at desktop width. | Responsive renderer check passed; horizontal table scroll is a known narrow-width behavior |
| 2026-11-21 | Desktop build | N/A | N/A | Build/type check; no screenshot comparison | `npm run typecheck`, `npm run build`, `npm run veyra:secret:check` | Passed; Vite reports the existing >500kB renderer chunk warning |
| 2026-11-21 | Website / Homepage hero (`WM-01`) | 1440x900 | `C:\tmp\veyra-ui-baseline\website-home-1440-final.png` | Captured and inspected against `dev/src/40_web.js::homePage`: white 2-column hero, 54px/60px title, 600/640px content proportions, reference copy/CTAs and light overlay preview. No rendered Figma frame was available; lower homepage sections remain outside this comparison. | HTTP 200, `/download` href verified, no browser page errors. | Hero visually checked against builder tokens/structure; full homepage remains incomplete |
| 2026-11-21 | Website / Homepage hero (`WM-01`) | 390x844 viewport, full-page capture | `C:\tmp\veyra-ui-baseline\website-home-390-final.png` | Captured after changing the illustration overlay to float within a 300px preview, matching the narrow source demo-frame behavior. Text and CTA stack; preview remains clipped to its intended compact frame. | HTTP 200 and headline rendered; no browser page errors. | Narrow hero checked; 834px and lower sections remain unverified |
| 2026-11-21 | Website production build | N/A | N/A | Production compile and route generation | `npm run typecheck`, `npm run build` | Passed; 42 routes generated |

## Required loop per milestone

1. Identify the exact screen builder and reference values.
2. Inspect the existing page/component and its data/API behavior.
3. Implement using existing components and services.
4. Run the relevant app and capture desktop plus narrow viewport screenshots.
5. Compare hierarchy, dimensions, type, color, spacing, states and overflow with the source.
6. Exercise navigation, form validation, loading, empty, success/error and authorization states that apply.
7. Record screenshot location and discrepancies before marking the screen implemented and verified.
