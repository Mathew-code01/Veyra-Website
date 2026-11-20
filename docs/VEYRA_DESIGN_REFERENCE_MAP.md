# VEYRA design reference map

Extracted from the shared `VEYRA-DESIGN-SPECS` source package. Exact global values below come from `dev/src/00_core.js`, `dev/src/10_ds.js`, `dev/src/20_kit.js`, `dev/src/30_shells.js`, and `docs/VEYRA_DESIGN_SYSTEM.md`. No value is inferred where the source does not specify one.

## Global tokens

| Token | Exact value |
|---|---|
| Navy | `#0B1330` |
| Ink / primary text | `#0F1B3D` |
| Ink-2 / secondary text | `#3B4766` |
| Muted text | `#6B7694` |
| Default line | `#E4E7F0` |
| Base background | `#F7F8FC` |
| White | `#FFFFFF` |
| Lavender 50 / 100 / 200 | `#F5F2FF` / `#EAE4FF` / `#D6CBFF` |
| Brand 500 / 700 | `#6B4FE0` / `#5638C4` |
| Success foreground/background | `#1F8A5B` / `#E6F5EE` |
| Warning foreground/background | `#9A6200` / `#FFF4DC` |
| Error foreground/background | `#C23B3B` / `#FDECEC` |
| Info foreground/background | `#2B6CB0` / `#E8F1FB` |
| Neutral gray | `#EEF0F6` |
| Dark surface/base, subtle, lavender | `#0B1330`, `#111A3D`, `#1D1B4B` |
| Dark text primary, secondary, muted | `#F4F5FA`, `#C3C9DB`, `#97A0BA` |
| Dark line | `#2A3358` |
| Dark brand 500 / 700 | `#9A85F5` / `#B9A9FA` |
| Dark success / warning / error / info | `#46C28A` / `#E6A93A` / `#F07A7A` / `#6AA9E9` |
| Typography | Inter 400, 500, 600, 700; fallback Roboto then Arial |
| Display | 56px / 64px, weight 700 |
| Page heading | 36px / 44px, weight 700 |
| Section heading | 24px / 32px, weight 600 |
| Subheading | 18px / 26px, weight 600 |
| Body | 16px / 24px, weight 400 |
| Body small | 14px / 20px, weight 400 |
| Label | 12px / 16px, weight 600 |
| Helper | 12px / 16px, weight 400 |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64px |
| Radius | 8, 12, 16, 24px |
| Motion | 120–200ms ease-out; overlay expansion 240ms; reduced motion instant/100ms fade |

The exact source declares three shadow styles but the system documentation does not enumerate their values. Source helper: `shadow(y,r,a)` uses offset `(0,y)`, blur radius `r`, spread `0`, color RGB `(0.06,0.1,0.24)` with alpha `a`. Screen builder calls provide actual y/r/alpha. No global letter-spacing token is specified; individual text calls supply per-screen values (for example eyebrow text uses `ls:10`, uppercase labels often use 6 or 8).

## Common component dimensions and variants

| Component | Source dimensions / style |
|---|---|
| Button | 14px/600 label; horizontal padding 18px, vertical 10px; gap 8px; radius 10px. Primary, Secondary, Ghost, Danger × Default/Disabled. |
| Input | Field height 40px, horizontal padding 12px, radius 10px; Default border 1px, Focus/Error 2px; value 14px and helper 12px. |
| SearchField | 280×38px default; 12px horizontal padding, 8px gap, radius 10px. |
| Badge | Horizontal padding 10px right / 8px left, vertical 3px, 6px icon gap, pill radius; six tones (tone keys in TONE source). |
| Card | Common builder default padding 20px, gap 14px, radius 16px, 1px line border; per-screen overrides are common. |
| Switch | 40×24px, 12px radius, 18px knob. |
| Checkbox | 18×18px box, 5px radius. |
| Tab | 14px label; horizontal auto layout; 2px active indicator. |
| Nav item | 9px vertical / 12px horizontal padding; 10px radius; 17px icon. |
| Overlay control | 34×34px, circular; common panel control helper defaults to 28×28px. |
| Table row | 48px high; 16px horizontal padding, default vertical 14px; header vertical 10px. |
| Modal | Default 440px wide, 24px padding, 16px radius, 14px internal gap. Destructive/default variants. |
| Drawer | Common helper default 420px wide, 24px padding, 16px gap. Screen calls may override width/height. |
| Overlay panel | Status chips use 3px/9px/3px/7px padding and 11px text; use per-state builder for panel size. |

Families: Button, Badge, Input, Switch, Checkbox, Tab, NavItem, OverlayControl, Alert, Progress, Toast, StatusDot, TableRow, Modal, SearchField, Card, ProviderCard, ModelCard, PricingCard, Tooltip, Drawer (21). The documented total is 57 variants. Shared builder warns that screen-local tables/modals/drawers are visually styled but are not component instances.

## Shell/layout hierarchy

- Marketing header: 68px high; desktop horizontal padding 48px, mobile 20px. Exact nav links/hidden breakpoints are in `30_shells.js` and page builders.
- Desktop/portal/admin sidebar: desktop width defaults to 236px, compact width 68px; padding 16px vertical and 12px horizontal (compact 10px horizontal); navigation item 9×12px padding, 10px gap, 10px radius.
- Desktop title bar: 40px high; 14px horizontal padding.
- App, portal and admin content widths/gutters vary by shell and screen. Inspect their shell builder and screen definition; no single universal content width is declared here.
- Web marketing sections frequently use 48–64px horizontal content inset at 1440px; responsive values are defined by each page builder.

## Overlay and evidence treatment

- White surface at 80% opacity, background blur 24px, white hairline and soft shadow.
- Text sits on a plate with opacity at least 0.80 for readability.
- Confirmed evidence: solid green outline and “Confirmed by you”. AI content: dashed lavender outline and “AI suggestion”. Keep provenance distinct.
- Mic/screen chips communicate on/off/paused/blocked. Capture must never start silently; active state stays visible.

## Icons and assets

- The package embeds 46 Lucide-style SVG path icons in `dev/src/00_core.js`; use the corresponding existing Lucide library in the production app, not emoji. Names/paths are extracted from the `ICONS` object in that file.
- SVG assets: `plugin/assets/veyra-app-icon.svg`, `veyra-mono.svg`, `veyra-symbol.svg`. The design system says the marks are proposed, not approved. Do not silently replace the existing production brand with them.

## Responsive and prototype references

- Registered responsive screens: ZR-01 tablet 834px, ZR-02 mobile 390px, ZR-03 pricing mobile 390px, ZR-04 desktop narrow 900px.
- Overlay width variants: ZO-01 300px, ZO-02 380px, ZO-03 520px.
- Screen IDs and intended builder/area mapping are in `VEYRA_DESIGN_COVERAGE_MATRIX.md`; prototype edges are registered in `dev/src/45_registry.js` (`LINKS`).

## Unspecified or provisional

- Dark token values are explicit in the source but the handoff says the Figma dark variable mode can be omitted when the plugin mode limit applies. Whether every production product surface supports dark mode remains an application-level requirement.
- The global shadow style names and all per-screen geometry require inspecting the corresponding builder call; no universal numeric shadow, page padding, sidebar grouping for every app, or responsive breakpoint is specified.
- Design system version 0.2 is proposed, not approved. Generated frames are unreviewed in real Figma; individual written screen interaction specifications remain unfinished.
