---
version: alpha
name: Codesign (Warm Editorial)
description: Warm editorial "Claude Design" reference — cream surfaces, terracotta accent, editorial serif, geometric sans. Mirrors open-codesign's design system.
colors:
  primary: "#C96442"
  secondary: "#1F1D18"
  background: "#FAF8F3"
  surface: "#FFFFFF"
  surfaceMuted: "#F3EFE6"
  text: "#1F1D18"
  muted: "#57544C"
  subtle: "#8C887D"
  border: "#E3DDD0"
  accent: "#C96442"
  highlight: "#B75636"
  success: "#4F7A52"
  warning: "#B8862A"
  error: "#B04030"
typography:
  display:
    fontFamily: Fraunces, "Times New Roman", Georgia, serif
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  body:
    fontFamily: Geist, "Plus Jakarta Sans", system-ui, sans-serif
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.005em
  mono:
    fontFamily: "JetBrains Mono", ui-monospace, monospace
    fontWeight: 400
rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 14px
  xl: 14px
  2xl: 18px
  full: 9999px
spacing:
  unit: 4
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 48px
  5xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
---

## Overview

Codesign is the "warm editorial" aesthetic: cream paper surfaces, a single
terracotta accent, an editorial serif reserved for brand moments, and a clean
geometric sans doing the everyday work. It reads like a well-set document — calm,
literate, and unmistakably warm — with technical precision underneath (tabular
mono numerals, strict 4px spacing, discrete radius and shadow levels).

It is the open-source counterpart to Anthropic's Claude Design look. The base
surface is never pure white; the text is never pure black; dark mode is warm
charcoal, never blue-black.

## Colors

- `accent` (`#C96442`) — terracotta; the only brand hue. Primary CTAs, links,
  focus rings, selected states, brand chrome. Dark mode brightens to `#D97757`.
- `background` (`#FAF8F3`) — warm cream; the page canvas. Never `#FFFFFF` in
  light mode.
- `surface` (`#FFFFFF`) — cards, panels, inputs sit a step lighter than the cream
  canvas.
- `surfaceMuted` (`#F3EFE6`) — section bands, table headers, quiet fills.
- `text` (`#1F1D18`) — warm near-black brown for body and headings; never `#000`.
- `muted` (`#57544C`) / `subtle` (`#8C887D`) — secondary copy, metadata, captions.
- `border` (`#E3DDD0`) — warm taupe hairlines; the primary separation device.
- `success` / `warning` / `error` (`#4F7A52` / `#B8862A` / `#B04030`) — muted,
  desaturated; for status only, never decoration.

Greys are warm (brown-tinted), never cool/slate.

## Typography

Fraunces (editorial serif, analogous to Tiempos) is the display face — but it is
**reserved for brand moments**: hero wordmark, large editorial headlines. Body
copy, UI labels, headings inside the product, and all controls use the geometric
sans (Geist in the app, Plus Jakarta Sans on the marketing site) at weight 600
for headings, 400 for body, with slightly negative tracking.

Numerals, prices, metrics, code, and keyboard chips use JetBrains Mono with
tabular figures (`tnum`) so columns align.

Type scale is a strict 8 steps: 10 / 12 / 13 / 15 (body) / 17 / 20 / 28 / 36,
extending to 48 for heroes.

## Layout

Marketing sections cap at ~960px and centre, with generous vertical padding
(~56px top of section, 64px+ around CTAs). Prose caps around 60ch. Card grids use
`repeat(auto-fit, minmax(240–280px, 1fr))`. The app shell is a frameless Electron
window with a 72px titlebar. Spacing snaps to the 4px grid throughout.

## Elevation & Depth

Depth comes first from tonal separation — surface tints over the cream canvas —
and 1px warm borders. Shadows are soft, warm-tinted (brown alpha, not black), and
reserved for things that genuinely float: hover-lifted cards, menus, modals.
Three discrete levels only (soft / card / elevated). Dark mode swaps to
black-based alphas. Nested surfaces never carry a larger radius than their parent.

## Shapes

Radii are friendly and on the larger side: 6px on small controls, 10–14px on
buttons and cards, 18px on large panels, full pill for badges and avatars.

## Components

- **Buttons**: radius md (10px), weight 500, heights 32 / 40 / 48. Primary =
  terracotta background, white text, soft shadow, hover darkens. Secondary =
  white surface with 1px border, hover fills to `surface-hover`. Ghost =
  text-only, hover fills.
- **Cards**: surface background, 1px border, radius xl (14px), soft shadow.
  Interactive cards lift `translateY(-2px)` on hover, border shifts to
  `accent-muted`, shadow steps up to card.
- **Inputs**: 40px height, ~10px radius, 1px border; focus shows a 2px terracotta
  ring at low alpha with 2px offset (the global focus-visible style).
- **Badges / step markers**: ~28px circle, `accent-muted` fill, `accent` text,
  weight 600.
- **Tables**: hairline rows, header on `surfaceMuted`; a highlighted column uses
  `accent-muted` background with `accent` text.
- **Device frames**: phone/tablet mocks use a deep space-gray body, deliberately
  distinct from the cream canvas so the device reads as a physical object.

## Do's & Don'ts

**Do**
- Anchor on cream surfaces and warm-tinted shadows; let borders and tints do most
  of the separating.
- Keep terracotta as the single accent; put it on the primary action and brand.
- Reserve Fraunces for one or two brand moments per page.
- Use tabular mono numerals for every figure, price, and metric.
- Animate briskly (120–200ms) with `cubic-bezier(0.22, 1, 0.36, 1)`.

**Don't**
- Use pure white backgrounds or pure black text.
- Introduce a second accent hue, or use status colors decoratively.
- Set body copy, UI labels, or controls in the serif.
- Drop hard black shadows in light mode, or float elements that shouldn't float.
- Animate longer than 300ms — the feel is calm, not sluggish.

## Responsive Behavior

Below ~768px, marketing heroes drop from ~48px to ~28–32px display type, section
padding compresses from 56–64px toward 32px, and multi-column card grids reflow
to a single column. The app's side panels collapse; dense rows stay as compact
rows rather than reflowing into cards. Dark mode is preserved across breakpoints.

## Agent Prompt Guide

When asked to design "in the codesign / warm-editorial style":
1. Start on cream `#FAF8F3` with warm near-black `#1F1D18` text and `#E3DDD0`
   borders. Dark mode is warm charcoal `#1A1815`, not blue-black.
2. Use terracotta `#C96442` as the only accent — primary CTA, links, focus.
3. Set everything in the geometric sans; bring in Fraunces only for one brand
   headline or wordmark.
4. Use JetBrains Mono with tabular figures for all numbers and code.
5. Build depth with borders and surface tints; keep shadows soft, warm, and rare.
6. Snap spacing to a 4px grid, use the 8-size type scale, and keep motion under
   300ms with the standard ease-out curve.

---
*Mirrors the open-codesign design system (packages/ui/src/tokens.css). Typefaces
are OFL: Fraunces (≈ Tiempos), Geist (≈ Styrene), JetBrains Mono. Inspired by the
Anthropic Claude Design aesthetic; not affiliated with brand owners.*
