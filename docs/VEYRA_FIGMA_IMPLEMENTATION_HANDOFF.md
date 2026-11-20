# VEYRA design-to-implementation handoff

## Source package

Reference directory: `C:\Users\MATTHEW\Desktop\VEYRA-DESIGN-SPECS` (read-only; preserve it). The package contains 119 registered screen records across 19 sections, generated design-system tokens/components, prototype flow metadata, and three SVG brand marks plus an SVG app icon.

The package is a Figma plugin generator. Its JavaScript uses Figma node/component APIs and is not production React/browser code. Translate values and structures into each existing application's component stack.

## Visual source facts

- Palette, typography, spacing, radius, reusable family/variant inventory and overlay treatment are transcribed in `VEYRA_DESIGN_REFERENCE_MAP.md` and `VEYRA_DESIGN_REFERENCE_MAP.json`.
- Design System v0.2 is explicitly proposed. Brand marks are proposed, and the package notes variable bindings are incomplete.
- Inter is specified at weights 400/500/600/700, with Roboto then Arial fallbacks. Type sizes and line-heights are exact in the token map; letter spacing is not specified globally.
- Shared frame builders use content-specific padding, gaps, widths and heights; these values must be extracted from the relevant source screen rather than generalized as universal tokens.
- Overlay specification uses white at 80% opacity, 24px blur, white hairline and soft shadow, with text on a plate at opacity at least 0.80. Confirmed evidence uses a solid green outline; AI suggestions use dashed lavender.
- Motion is documented at 120–200ms ease-out, overlay expansion 240ms, reduced motion instant/100ms fade. Motion is documented but not encoded as prototype transitions.

## Prototype cautions

- The manifest says its frames are purpose-built sample layouts and have not been visually reviewed in real Figma.
- The handoff explicitly says per-screen purpose/interactions/states/responsive specs remain unwritten (work item W-08).
- Prices, plans, allowances, provider/model names and legal text are placeholders. Do not ship them as facts.
- Sample user data and sample admin metrics are not production data.
- Some design builder controls are visual stand-ins, not working interactions. Every production control needs the real application action and states.
- No screenshot-based visual QA has been performed in this execution. Record a comparison only after capturing and inspecting a rendered application screen.

## Implementation status

See `VEYRA_DESIGN_COVERAGE_MATRIX.md` for all manifest IDs, assigned builder, current matching route/screen, design/functionality status and recommended action. See `VEYRA_VISUAL_QA_REPORT.md` for captured comparisons and outstanding visual review.
