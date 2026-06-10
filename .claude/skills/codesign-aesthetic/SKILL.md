---
name: codesign-aesthetic
description: >-
  Warm editorial "Claude Design" UI aesthetic — cream paper surfaces, a single
  terracotta accent, Fraunces serif for brand moments, Geist sans for the UI,
  and JetBrains Mono tabular numerals. Use when building or restyling landing
  pages, dashboards, slide decks, docs, or app UI that should feel warm, calm,
  editorial, and precise (the open-codesign / Anthropic Claude Design look).
  Trigger keywords: warm cream, terracotta, editorial, paper-like, Anthropic /
  Claude Design style, "make it premium and calm", "match codesign styling".
---

# Codesign Aesthetic — Warm Editorial UI

> The soul, in one line: **editorial warmth meets technical precision.** Cream
> paper, one terracotta accent, a serif kept for brand moments, a clean sans for
> the work, and monospaced tabular numerals for the data.

This skill captures the visual language shared by the open-codesign website and
desktop app (declared in `packages/ui/src/tokens.css` as the "Anthropic Claude
Design aesthetic"). Apply it to reproduce that look in any project.

Two companion files live in this folder — read them when you need exact values:

- **`tokens.css`** — paste-ready CSS custom properties (light + dark) and font
  setup. Drop into a project and build against the variables.
- **`DESIGN.md`** — the same system in brand-reference / design-baton format
  (token frontmatter + prose). Drop into a workspace as its `DESIGN.md`, or use
  it as a `brand:`-style reference.

## When to use

- A request asks for a warm, calm, editorial, "premium but not flashy" feel.
- Marketing pages, dashboards, decks, documentation, or app chrome that should
  read like warm paper, not a cold SaaS template.
- "Make it look like Claude Design / Anthropic / open-codesign."
- Restyling an existing UI to this palette and rhythm.

## When NOT to use

- The brief calls for a different identity (neon, glass, brutalist, corporate
  blue, pure-black dark mode). Don't force cream + terracotta onto it.
- A specific brand reference is already supplied — honor that instead.

## The 8 non-negotiables

1. **Warm everything.** Background is cream (`#FAF8F3`), never pure white. Text
   is warm near-black brown (`#1F1D18`), never `#000`. Dark mode is warm
   charcoal (`#1A1815`), never blue-black. Grays are warm, never cool/slate.
2. **One accent only.** Terracotta (`#C96442`, dark mode `#D97757`) is the sole
   brand color. Never introduce a second hue. Success / warning / error exist
   but are muted and used sparingly for status, not decoration.
3. **Serif is a special occasion.** Fraunces (editorial serif) is reserved for
   explicit brand moments — hero wordmark, large editorial display. App headings
   and UI use the **sans at weight 600**. Never set body, labels, or controls in
   serif.
4. **Tabular numerals for data.** Any number, price, metric, token count, or
   code uses JetBrains Mono with `font-feature-settings: "tnum"` so columns
   align and digits don't jump.
5. **Strict scales, no magic numbers.** Spacing is a 4px grid. Type is 8 fixed
   sizes (10/12/13/15/17/20/28/36). Radius and shadow each have a few discrete
   levels. Don't invent in-between values.
6. **Tonal separation before shadows.** Build depth with surface tints and 1px
   warm borders first. Reserve shadows for things that actually float (menus,
   modals, hover-lifted cards). Shadows are **soft and warm-tinted**, never hard
   black.
7. **Subtle editorial motion.** Transitions are `< 300ms` (usually 120–200ms),
   eased with `cubic-bezier(0.22, 1, 0.36, 1)`. Hover lifts 1–2px; press settles
   to `scale(0.96)`. Always respect `prefers-reduced-motion`.
8. **Tokens, never hardcode.** Reference CSS variables (`var(--color-accent)`),
   not literal hex, in component code. Add a token before reaching for a literal.

## Color

Canonical sRGB hex (the app source also ships OKLCH equivalents — either is fine,
hex is the portable default). Full set in `tokens.css`.

| Role             | Light       | Dark        | Use                                   |
| ---------------- | ----------- | ----------- | ------------------------------------- |
| background       | `#FAF8F3`   | `#1A1815`   | page canvas (cream / warm charcoal)   |
| background-2     | `#F3EFE6`   | `#221F1B`   | section bands                         |
| surface          | `#FFFFFF`   | `#26221D`   | cards, panels, inputs                 |
| surface-hover    | `#F7F4EC`   | `#2D2925`   | hover fill                            |
| border           | `#E3DDD0`   | `#3A352F`   | hairlines, dividers                   |
| accent           | `#C96442`   | `#D97757`   | primary CTA, links, focus, brand      |
| accent-hover     | `#B75636`   | `#E88868`   | accent hover                          |
| accent-muted     | `#F3D9CF`   | `#4A2B22`   | accent tint backgrounds, badges       |
| text-primary     | `#1F1D18`   | `#F5F1E8`   | body + headings (warm, not black)     |
| text-secondary   | `#57544C`   | `#B8B3A6`   | secondary copy                        |
| text-muted       | `#8C887D`   | `#807B6F`   | metadata, captions                    |
| success          | `#4F7A52`   | `#6B9C6E`   | status only — sage                    |
| warning          | `#B8862A`   | `#D4A04A`   | status only — amber                   |
| error            | `#B04030`   | `#D96050`   | status only — brick                   |

## Typography

- **Display (brand only):** `"Fraunces Variable", "Times New Roman", serif` —
  editorial serif (analogous to Anthropic's Tiempos). OFL licensed.
- **Sans (everything else):** `"Geist Variable", system-ui, sans-serif`. The
  marketing site uses `"Plus Jakarta Sans"` — either reads as a clean geometric
  sans. Headings: weight 600, tracking `-0.01em` to `-0.02em`.
- **Mono:** `"JetBrains Mono Variable", ui-monospace, monospace` with `"tnum"`.
- **Type scale (px):** 10 · 12 · 13 · **15 = body** · 17 · 20 · 28 · 36
  (display goes to 48 for heroes).
- **Line height:** headings 1.2, UI 1.4, body 1.6. **Tracking:** headings
  negative; all-caps labels `+0.08em`.

## Scales

- **Spacing (4px grid):** 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 48, 64.
- **Radius:** sm 6 · md 10 · lg 14 · xl 14 · 2xl 18 · full 9999 (friendly, on the
  larger side). Nested surfaces never have a larger radius than their parent.
- **Shadow (warm-tinted, three levels):**
  - soft `0 1px 2px rgba(31,29,24,.04)`
  - card `0 2px 8px rgba(31,29,24,.06)`
  - elevated `0 8px 24px rgba(31,29,24,.1)`
  - (dark mode swaps to black-based alphas — see `tokens.css`.)
- **Motion:** ease `cubic-bezier(0.22, 1, 0.36, 1)`; durations 120 / 150 / 200 /
  300ms; hover lift `translateY(-1px..-2px)`; press `scale(0.96)`.

## Component recipes

**Button** — radius md, `font-medium`, `gap-2`, focus ring `2px` accent at low
alpha, `disabled:opacity-50`. Heights sm 32 / md 40 / lg 48.
- primary: `bg accent`, white text, soft shadow, hover → `accent-hover`.
- secondary: `bg surface`, 1px border, hover → `surface-hover`.
- ghost: `text-secondary`, hover → `surface-hover` fill.

**Card** — `bg surface`, 1px border, radius xl (14), soft shadow. Interactive
cards on hover: `translateY(-2px)`, border → `accent-muted`, shadow → card.

**Focus (global):** `outline: 2px solid var(--color-focus-ring); outline-offset:
2px;` on `:focus-visible` for every interactive element. Never remove it without
a replacement.

**Status / step badge:** small circle (≈28px), `bg accent-muted`, `text accent`,
weight 600 — the numbered-step and counter pattern.

**Comparison table:** hairline rows, header on `surface-muted`, the "ours"
column highlighted with `accent-muted` background + `accent` text.

**Device frame:** a phone/tablet mock uses a deep space-gray body
(`oklch(0.22 0.005 280)`), intentionally distinct from the cream canvas so the
device reads as a physical object.

## Do / Don't

**Do**
- Use cream surfaces and warm-tinted shadows; let borders + tints carry most
  separation.
- Keep terracotta as the single accent; use it on the primary action and brand.
- Reserve Fraunces for one or two brand moments per page.
- Use tabular mono numerals for every figure, price, and metric.
- Animate briskly (120–200ms) with the standard ease-out curve.

**Don't**
- Use pure white backgrounds or pure black text.
- Introduce a second accent hue, or use status colors decoratively.
- Set body copy, UI labels, or controls in the serif.
- Drop hard black shadows in light mode, or float flat elements that shouldn't.
- Hardcode hex in components — go through tokens.

## Final self-check

Before calling a screen done:

- [ ] Background reads cream, not white; no `#000` text anywhere.
- [ ] Exactly one accent hue (terracotta) is in use.
- [ ] Serif appears only at brand moments; all UI text is the sans.
- [ ] Every number/price/metric is mono with tabular figures.
- [ ] Spacing snaps to the 4px grid; type uses the 8-size scale.
- [ ] Shadows are soft and warm; depth comes mostly from borders + tints.
- [ ] Hover/press/focus states exist on every interactive element.
- [ ] Motion is `< 300ms` and `prefers-reduced-motion` is respected.
- [ ] Dark mode is warm charcoal, not blue-black.

## Portability — reuse this skill anywhere

This folder is self-contained. To use it in another project, copy the whole
`codesign-aesthetic/` directory into that project's skills location:

```
<project>/.claude/skills/codesign-aesthetic/
```

Then either let the model auto-invoke it by description, or call it by name. To
adopt the tokens directly, copy `tokens.css` into the project's stylesheet and
import the three fonts (Fraunces, Geist, JetBrains Mono — all OFL). To seed a
workspace design system, copy `DESIGN.md` in as the project's design baton.

No external dependencies, no build step, no references outside this folder.
