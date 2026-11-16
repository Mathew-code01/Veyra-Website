# VEYRA Website design system

## Direction

Use the supplied showcase as a cue for light surfaces, navy typography, indigo focus, and compact desktop product imagery. Keep the production experience quieter and more trustworthy than the reference: do not copy its “Vera” identity, sample prices, invented dashboard metrics, fake recent activity, or browser interview CTA.

The Website explains and supports the Desktop application. Any capture, practice, local model, or live-assistance capability shown must be labelled as a Desktop capability and accurately reflect permissions and current product behavior.

## Tokens

The shared values live in `src/app/globals.css` and Tailwind config.

| Token | Value/use |
|---|---|
| Background | Warm white (`--background`) for page canvas. |
| Surface | White card on a cool-grey secondary surface. |
| Text | Deep navy foreground; muted slate for supporting copy. |
| Primary | Indigo for primary actions, selected states, and keyboard focus. |
| Secondary accent | Violet only for small supporting highlights, not full-page gradients. |
| Borders | Cool grey, thin and low contrast while retaining visible control boundaries. |
| Radius | `--radius: 0.875rem`; reserve larger radii for hero media and major panels. |
| Font | System UI/Inter-compatible stack; keep body copy readable and headings compact. |

## Type scale and content

- Page title: 32–40px with tight tracking; avoid oversized headings on every section.
- Section title: 24–32px.
- Card title: 16–20px.
- Body: 14–16px with comfortable line height.
- Metadata/labels: 12–13px; never use small text for essential state or consent.
- Use one clear heading per section and short, specific supporting copy.
- Use real account data for metrics. Use explicit loading, unavailable, and empty states where data is absent.

## Components and layout

- Marketing content uses a centered max-width container and responsive two-column layouts only when the visual supports them.
- Portal views prioritize a clear title, one key action, and information hierarchy before decorative cards.
- Prefer restrained borders and shadows over repeated nested cards.
- Use Lucide React icons consistently; do not use Unicode as brand artwork.
- Buttons, links, inputs, tables, dialogs, and navigation must have visible hover, focus, disabled, loading, and error states.
- Keep tables horizontally scrollable or adapt them to stacked rows on narrow screens.

## Motion and accessibility

- GSAP is used for the marketing hero and is gated by `prefers-reduced-motion: no-preference`.
- CSS smooth scrolling and transitions are disabled/reduced when `prefers-reduced-motion: reduce` is active.
- Keep motion short and purposeful; do not animate account metrics or imply live activity with decorative pulses.
- Preserve semantic headings, keyboard access, clear focus rings, sufficient contrast, and reduced-motion behavior.

## Product truth

- Never invent price, currency, credit balance, activity, subscription state, devices, or release availability.
- Live listening and screen context require explicit Desktop permissions and visible user control.
- Label static interface imagery as illustrative; do not present mock content as live state.
- Local inference runs on Desktop; cloud requests and billing depend on configured Platform services.
# Reference-panel workflow

`public/design-references/` contains nine panel crops plus a separate detected-state overlay crop, derived from the supplied 1536×1024 showcase image. `README.md` maps each panel to its intended screen and records that the sample prices, metrics, people, and activity are illustrative and must not enter production UI as product facts.

The homepage uses the marketing hero crop for composition and desktop product preview; the auth layout uses the sign-in crop for a focused form beside product context; pricing remains data-driven. Dashboard, practice, assessment, and live overlay crops are implementation references for their respective Website/desktop contexts, not customer data or screenshots of a running session.

## Implemented direction

- Warm cool-white surfaces, deep navy type, restrained indigo/violet accents, fine borders, and layered low-contrast shadows.
- Inter/system typography on the marketing experience, with compact labels and a clear title/body scale.
- Responsive two-column authentication composition that collapses to the form on narrow screens.
- Product previews explicitly labeled as illustrative; live capture is shown off until enabled in Desktop.
- Reduced-motion support and small hover/entrance transitions; no new heavy animation dependency.

The Website's account portal and all Desktop screens are not yet fully redesigned. Keep this document as the shared visual direction and do not describe unimplemented screens as completed.
