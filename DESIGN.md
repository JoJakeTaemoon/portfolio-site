---
name: Jake Tae-moon Jo — Portfolio
description: An engineering lead's portfolio drawn as an annotated blueprint — facts, figures and decisions on warm paper, one green ink.
colors:
  ledger-green: "#2f5d50"
  ledger-green-wash: "#e5eee9"
  paper: "#fbfaf7"
  card-white: "#ffffff"
  ink: "#1c1c1a"
  graphite: "#6b6a65"
  rule-line: "#e4e1d9"
  ledger-green-night: "#84c7ac"
  ledger-green-wash-night: "#1f2e28"
  paper-night: "#121312"
  card-night: "#1a1b1a"
  ink-night: "#ebeae5"
  graphite-night: "#9b9a94"
  rule-line-night: "#2b2c2a"
  group-client: "#3b62b0"
  group-data: "#8f641c"
  group-external: "#a1414a"
  group-process: "#545a74"
  group-human: "#7b3f8f"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Segoe UI, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Segoe UI, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
  figure:
    fontFamily: "-apple-system, BlinkMacSystemFont, Pretendard, Apple SD Gothic Neo, Noto Sans KR, Segoe UI, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.25
    fontFeature: "tnum"
rounded:
  md: "12px"
  pill: "999px"
  frame-phone: "26px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "16px"
  s4: "24px"
  s5: "40px"
  s6: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-green}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
    width: "100%"
  pill-link:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "5px 16px"
  pill-link-hover:
    textColor: "{colors.ledger-green}"
  card:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.md}"
    padding: "20px"
  chip-tag:
    backgroundColor: "{colors.ledger-green-wash}"
    textColor: "{colors.ledger-green}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 9px"
  metric-tile:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ledger-green}"
    typography: "{typography.figure}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
---

# Design System: Jake Tae-moon Jo — Portfolio

## Overview

**Creative North Star: "The Annotated Blueprint"**

The site reads like an engineer's drawing set that someone has annotated for a reader in a hurry. Warm paper, black ink and a single green pen. Every project is a sheet: the headline claim, the figures that prove it, and margin notes (sources, captions, decision cards) that a developer can follow down to the code. Nothing on the sheet is decorative. Diagrams, timelines, paired bars, route maps and cover marks are all drawn from the project's own data.

Density is moderate. Generous line height carries mixed Korean and English text, and long pages are made navigable with a right-hand rail, a table of contents and a thin progress line instead of being cut short. Motion only orients the reader: one reveal per section, a 200 ms settle, and nothing at all when reduced motion is set. Restraint is the brand. Confidence comes from evidence placed precisely, not from colour or scale.

**Key Characteristics:**
- Warm paper ground, near-black ink, one green accent (Ledger Green).
- Figures and covers are drawn from data or key symbols, never stock imagery.
- Real product screens appear only inside CSS device frames, masked.
- The 12px radius and the pill are the only two shapes. Borders before shadows.
- Equal Korean and English. Print is a first-class output.

## Colors

One green ink on warm paper, with a set of quiet group colours reserved for diagrams.

### Primary
- **Ledger Green** (`ledger-green`): the only accent. Metric figures, the primary download button, links on hover, the active nav underline, focus rings, timeline marks, and the strokes of the cover art. At night it becomes **Ledger Green Night** (`ledger-green-night`) so it keeps its contrast.
- **Ledger Green Wash** (`ledger-green-wash`): the tinted ground for tags, generated covers and figure panels.

### Neutral
- **Warm Paper** (`paper`): the page ground. Slightly warm so long reading stays soft.
- **Card White** (`card-white`): raised surfaces such as cards, metric tiles, tables and the key-facts box.
- **Ink** (`ink`): body text and headings.
- **Graphite** (`graphite`): secondary text: periods, labels, captions and sources. It measures about 5.2:1 on paper.
- **Rule Line** (`rule-line`): every border and divider.

### Tertiary (diagram groups only)
- **Group colours** (`group-client`, `group-data`, `group-external`, `group-process`, `group-human`) each have a pale fill and a strong stroke. They tell the actors in architecture diagrams apart. `group-external` also marks the one "bound" or highlighted element in a figure.

### Named Rules
**The One Ink Rule.** Ledger Green is the only accent colour in the interface. Group colours live inside figures and never on buttons, links or headings.

**The Night Pair Rule.** Every colour has a night value tuned for the dark theme. Never hard-code a light value inside a component.

## Typography

**Display Font:** system UI sans (Pretendard and Apple SD Gothic Neo for Korean, Segoe UI elsewhere)
**Body Font:** the same stack
**Label Font:** the same stack, with tabular figures for numbers
**Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, only for annotations (IDs, dates, figure sources)

**Character:** one neutral sans in several weights. The hierarchy comes from size and weight, not from family changes. Korean wraps by word (`word-break: keep-all`), so headings never split a word.

### Hierarchy
- **Display** (700, `clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)`, 1.3, balanced wrap): page titles and the hub headline.
- **Headline** (700, 1.5rem, 1.3): section titles.
- **Title** (700, 1.05rem, 1.3): card titles and figure titles.
- **Body** (400, 16px, 1.7): paragraphs. The case body is held to about 65ch beside the rail.
- **Label** (600, 13px minimum): tags, table heads, key-fact labels. Nothing on screen is smaller than 13px, except the digits inside the 22px timeline dots, which are 11px.
- **Annotation** (mono, 13px, graphite): decision IDs, timeline and career dates, figure sources. They read as margin notes: a short ink rule on the left for IDs and sources, no fill.
- **Figure** (700, 1.6rem, tabular numbers, Ledger Green): metric values.

### Named Rules
**The Thirteen Floor Rule.** No readable text below 13px on screen, measured as rendered: figure text is set in SVG user units, so figures are never drawn narrower than 0.97 of their viewBox (they scroll sideways on phones instead of shrinking) and the route map has its own label size per crop. Print may go to 8.5pt to keep the career summary at three pages.

**The Margin Note Rule.** One annotation device across the hub and the cases: mono for IDs, dates and sources, and a faint drafting grid (1px line every 24px, 5% ink in light, 6% in night) behind figure panels. Screen only; print stays plain.

## Layout

- **Container:** one centred column, at most 72rem, with 16px side gutters.
- **Spacing:** a six-step scale (4 / 8 / 16 / 24 / 40 / 64px). Sections are separated by the two largest steps.
- **Breakpoint:** 720px is the main one. Below it, tables become stacked rows and metric grids drop to two columns. The hub text measure is held to about 68ch.
- **Wide screens (from 1100px):**
  - The hub hero splits into the intro on the left and the metric tiles on the right: four tiles, the first (24h) is the lead and spans the full width.
  - Case pages gain a sticky right rail (cover, key facts, metrics, PDF link, table of contents).
- **Hub cards:** a 1-2-3 hierarchy on a six-column grid. The lead card spans all six as a horizontal card (cover left, text right); cards 2 and 3 span three columns each, cards 4 to 6 span two. From 720px to 999px cards 2 to 6 span three. Phones are one column. Smaller cards keep equal cover heights (156px); taglines are clamped to four lines on screen.

**The Rail Rule.** Facts that a reader checks repeatedly (period, role, team, metrics, contents) sit in the rail. The story stays in the column.

## Elevation & Depth

Flat by default. Depth comes from the tonal step from paper to card and from 1px rule lines. There is one ambient shadow for resting cards, and a slightly deeper one only in response to hover or focus. Night mode drops shadows entirely and relies on the tonal steps.

### Shadow Vocabulary
- **Resting card** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px rgb(0 0 0 / 0.04)`): cards and tiles at rest, light theme only.
- **Raised on hover** (a slightly deeper version of the same): a featured card under the pointer or keyboard focus, together with a 2px lift.

### Named Rules
**The Border-First Rule.** Separate with a rule line before reaching for a shadow. A shadow means "this responds to you".

## Shapes

- There are two shapes: a gently rounded rectangle (12px) for cards, tiles, tables, covers and figure panels, and a full pill for tags, filter chips and contact links.
- Device frames are the one exception. The phone frame has a 26px radius and a 9px bezel; the laptop frame has an 8px bezel and a base. Both are drawn in CSS.
- Flags are small rectangles with a 2px radius.

## Components

Refined and restrained: every component is a quiet container for evidence.

### Buttons
- **Primary (career-summary download):** full width, Ledger Green fill, card-white text, 12px radius. It brightens slightly on hover and shows a green focus ring offset by 3px.
- **Pill links (email, phone, page PDF):**
  - At rest: a card-white pill with a rule-line border and a leading 1em line icon.
  - On hover: the border and the text turn Ledger Green.

### Chips
- **Tags:** a Ledger Green Wash fill with Ledger Green text in a pill.
- **Filter chips:** an outlined pill with a count. The active chip takes the wash fill. They are at least 44px tall on touch screens.

### Cards / Containers
- **Featured card:** a card-white surface with a 12px radius and a rule-line border. The cover sits on top at a fixed 156px height (the lead card puts it on the left at full card height). On hover or focus the card lifts 2px, its border turns Ledger Green, its shadow deepens and the cover scales to 1.03, all within 200ms.
- **Metric tile:** a card-white tile with the value in the figure style and a two-line label underneath.
- **Key-facts box:** a card that lists labels and values (period, role, team, platform, context).

### Navigation
- **Top bar:** a sticky top bar with the name, section links, a Contact link (envelope plus label, a `mailto:` to the site email; the envelope alone with an accessible name on phones) and a ko/en toggle. The contact link sits on every page; the hero keeps its single wide PDF button.
- **Skip link:** the first tab stop is a skip-to-content link that appears on focus. The current section gets a 2px Ledger Green underline through scrollspy.
- **Other aids:** a 2px reading-progress line along the top edge, and a 44px back-to-top button at the bottom right of long pages.

### Figures (signature)
- **Variety:** architecture, flow, timeline (numbered dots linked to rows), paired bars (train/dev with negatives) and roles. All are inline SVG or HTML drawn from typed data.
- **Placement:** each sits on a panel over the drafting grid with a title, a one-line caption in plain style and a source line in mono. The hub's role-split figure (human, agent roles, review gates) reuses the EWA case's roles data.
- **Timeline dots:** hover-only links to their rows (not tab stops); the rows are the keyboard path.

### Covers (signature)
- **Hand-drawn key-symbol art:** film strip, transmission towers, gateway, factory, webtoon panels, policy shield, data funnel and academy.
- **Real screens:** a masked screenshot in a device frame. A phone screen peeks up from the bottom of the cover.

## Do's and Don'ts

### Do:
- **Do** draw every figure and cover from the project's own data or key symbol, in Ledger Green plus the group colours.
- **Do** keep motion to one reveal per section, about 200ms with ease-out, and none under `prefers-reduced-motion`.
- **Do** put real product screens only inside the CSS device frames, after masking and an image-by-image review.
- **Do** keep every interactive element at 44px on touch screens with a visible focus ring (verified with a coarse-pointer emulation, not only at 375px).
- **Do** serve images no wider than about twice their display size: card covers from 640px, 320px and 160px copies, archive thumbnails from 128px (`npm run thumbs`).
- **Do** check print: the career summary must stay at three pages.

### Don't:
- **Don't** add a second accent colour, gradients, glow, or decorative blobs.
- **Don't** use stock photos, emoji as icons, or illustrations unrelated to the project's mechanism.
- **Don't** use count-up numbers, parallax, scroll-jacking or autoplay with sound.
- **Don't** hide content behind JS. Everything must be in the static HTML.
- **Don't** let any client name, logo or brand colour appear in text, figures or images.
