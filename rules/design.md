# Synapse Design System (`design.md`)

Single source of truth for UI on every Synapse page. Derived from the landing page. If a page needs something not covered here, add it to this file first, then use it.

---

## 1. Design Principles

1. **Quiet paper, smart tutor.** Paper-white canvas, near-black text, minimal color. The interface should feel like a calm Notion-style workspace; intelligence lives in the content, not the chrome.
2. **Color is a signal, not decoration.** Blue = interactive/citation. Green = success/verified/grounded. Everything else is neutral gray.
3. **Borders over shadows.** Structure comes from 1px hairline borders. Shadows are rare and subtle.
4. **Small radii, tight density.** Corners are barely rounded (2–8px). Text is compact (12–16px), with generous whitespace between sections.
5. **Serif for ideas, sans for interface, mono for data.** See typography.
6. **Always show the source.** Any AI-generated claim shows a citation chip or source line.

---

## 2. Tech Stack & Setup

- Tailwind CSS (CDN build with `forms` and `container-queries` plugins), `darkMode: "class"`
- Fonts: **Inter**, **Source Serif 4**, **Space Mono** (Google Fonts)
- Icons: **Material Symbols Outlined** (Google Fonts)
- Tailwind config below is the **canonical token set**. Do not redefine tokens per page.

```html
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
```

Load each font link **once** (the landing page currently loads Material Symbols twice, so remove the duplicate).

Shared base CSS:

```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  font-size: 18px; line-height: 1;
  display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
}
.custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(55,53,47,.15); border-radius: 4px; }
```

Body defaults: `bg-surface text-text-primary antialiased selection:bg-surface-variant selection:text-text-primary min-h-screen flex flex-col font-body-md text-body-md`

---

## 3. Color Tokens

### 3.1 Core palette (use these 90% of the time)

| Token | Hex / Value | Use |
|---|---|---|
| `bg-canvas` | `#FFFFFF` | Cards, header, editor, inputs |
| `surface` / `background` | `#f9f9f7` | Page background, AI panel |
| `bg-sidebar` | `#F7F7F5` | Sidebars, callouts, alternating sections, footer, secondary buttons |
| `surface-container` | `#eeeeec` | Chips, tags, icon tiles, inline code |
| `surface-container-low` | `#f4f4f2` | Hover on cards/rows |
| `text-primary` | `#2F3437` | Body text |
| `notion-black` | `#050505` | Headlines, strongest emphasis, hover on dark buttons |
| `text-secondary` | `#787774` | Descriptions, metadata, inactive nav |
| `text-tertiary` | `#9B9A97` | Timestamps, hints, placeholders |
| `primary` | `#1a1f22` | Primary buttons, "AI" avatar, badges |
| `primary-container` | `#2f3437` | Header CTA, emphasized borders (`border-2`) |
| `on-primary` | `#ffffff` | Text on dark fills |

### 3.2 Borders and states

| Token | Value | Use |
|---|---|---|
| `border-subtle` | `rgba(55,53,47,.09)` | Default 1px border everywhere |
| `border-strong` | `rgba(55,53,47,.16)` | Inputs, dashed borders, popovers, secondary buttons |
| `bg-hover` | `rgba(55,53,47,.06)` | Hover for rows, nav links, ghost buttons |
| `bg-active` | `rgba(55,53,47,.10)` | Selected row / active item |

### 3.3 Accent colors

| Token | Value | Use |
|---|---|---|
| `interactive-blue` | `#0A85EA` | Links, active dot, citation hover, focus ring, "Feature 0X" eyebrow |
| `interactive-blue-hover` | `#0075D4` | Blue hover |
| `callout-green` | `#D9F5D6` | Success/verified background, highlight (`/60` opacity for inline highlight) |
| `callout-green-text` | `#2B593F` | Success/verified text, check icons |
| `error` / `error-container` | `#ba1a1a` / `#ffdad6` | Errors only |

### 3.4 Semantic tag colors (hardcoded in the landing page; use exactly these)

| Name | Background | Text | Use |
|---|---|---|---|
| Info tag | `#D3E5EF` | `#18537A` | Course codes, citation chips, "Lecture Notes" tags |
| Success tag | `#D9F5D6` | `#2B593F` | "Primary Lit", confidence badges |
| Neutral tag | `surface-container` | `text-secondary` | Lecture numbers, topics |

File-type badges (10% tinted bg + solid text, `font-code font-bold text-xs`):

| Type | Color |
|---|---|
| PDF | `#EB5757` |
| WEB | `#2F80ED` |
| AUDIO | `#9B51E0` |

Window-chrome dots: `#EB5757`, `#F2C94C`, `#27AE60` at 80% opacity.

### 3.3 Rules
- Never introduce new hex values inline if a token exists. The one-off values in 3.4 are the only approved exceptions.
- Do not use pure black for text. Use `text-primary`, or `notion-black` for headings.
- Use the full Tailwind token set in the config (Material-style `on-*`, `*-container`, `*-fixed` tokens) only when a page genuinely needs them. Default to section 3.1.

---

## 4. Typography

### 4.1 Families

| Role | Family | Tailwind |
|---|---|---|
| Display & headlines (editorial) | Source Serif 4 | `font-display`, `font-headline-lg`, `font-display-mobile`, `font-headline-lg-mobile` |
| UI, body, labels, small headings | Inter | `font-headline-md`, `font-headline-sm`, `font-body-*`, `font-label-*` |
| Code, metadata, keyboard hints, numbering | Space Mono | `font-code` |

### 4.2 Scale

| Token | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 44 / 52 | 700 | -0.02em | Hero H1 |
| `display-mobile` | 32 / 38 | 700 | -0.015em | Hero H1 on mobile |
| `headline-lg` | 34 / 40 | 600 | -0.015em | Section H2, feature H3 |
| `headline-lg-mobile` | 26 / 32 | 600 | -0.01em | Section H2 on mobile |
| `headline-md` | 22 / 28 | 600 | -0.01em | Sub-headings, mockup titles |
| `headline-sm` | 17 / 22 | 600 | -0.005em | Card titles, brand wordmark, step titles |
| `body-lg` | 16 / 26 | 400 | -0.005em | Lead paragraphs and subtitles |
| `body-md` | 14 / 20 | 400 | 0 | Default body, nav, list items |
| `body-sm` | 12 / 16 | 400 | 0.01em | Secondary copy, chat text |
| `label-md` | 14 / 18 | 500 | 0 | Buttons, field labels |
| `label-sm` | 12 / 16 | 500 | 0.01em | Eyebrows, chips, tabs |
| `code` | 13 / 18 | 400 | 0 | Code, mono metadata |

Always pair family + size: `class="font-headline-lg text-headline-lg"`. Setting only one will not apply the full style.

### 4.3 Conventions
- Headlines: `text-notion-black tracking-tight`.
- Descriptions: `text-text-secondary` with `leading-relaxed`.
- Hero emphasis: italic, `font-normal`, underlined with `underline decoration-border-strong underline-offset-8`.
- Eyebrow text: `font-label-sm uppercase tracking-wider font-semibold` (blue for feature numbers, `text-secondary` for section labels).
- Micro text sizes allowed in dense UI mockups: `text-[10px]`, `text-[11px]`, `text-xs`. Do not go smaller than 10px.
- Mobile: use `*-mobile` variants below `md` (e.g. `text-display-mobile md:text-display`).

---

## 5. Spacing, Layout & Grid

### 5.1 Custom spacing tokens

| Token | Value |
|---|---|
| `space-xs` | 0.25rem (4px) |
| `space-sm` | 0.5rem (8px) |
| `space-md` | 0.75rem (12px) |
| `space-lg` | 1.25rem (20px) |
| `space-xl` | 2rem (32px) |
| `gutter` | 1rem (16px) |
| `margin` | 1.5rem (24px) |

Standard Tailwind spacing (`gap-2`, `p-6`, `py-24`, etc.) is also used. Stick to a 4px rhythm.

### 5.2 Page container
- Width: `max-w-7xl mx-auto` (standard), `max-w-5xl` (CTA banner and mockup), `max-w-4xl` (pricing), `max-w-2xl` / `max-w-xl` (section intros and subtitles)
- Horizontal padding: `px-6 md:px-12`
- Header height: `h-14`

### 5.3 Vertical rhythm

| Context | Spacing |
|---|---|
| Hero | `pt-16 pb-20` |
| Major content sections | `py-24` |
| Pricing / CTA sections | `py-20` |
| Trust strip | `py-8` |
| Section intro to content | `mb-16` (`mb-14` for pricing) |
| Feature rows | `mb-24 pb-20 border-b border-border-subtle` |

### 5.4 Grids
- Feature rows: `grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`. Copy takes `lg:col-span-5`, visual takes `lg:col-span-7`. Alternate sides between rows by using `order-1/order-2` with `lg:` prefixes.
- Three-up cards: `grid grid-cols-1 md:grid-cols-3 gap-8` (testimonials use `gap-6`)
- Pricing: `grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8`
- App mockup: `grid grid-cols-12`, sidebar 3 / editor 5 / AI panel 4 columns, separated by `divide-x divide-border-subtle`. On mobile, hide the sidebar and let editor and AI panel go full width.

### 5.5 Breakpoints
Tailwind defaults. Primary switch points: `md` (768px) for nav, grids and type; `lg` (1024px) for 12-column feature rows.

---

## 6. Shape, Borders & Elevation

### 6.1 Radius (overridden in config)

| Class | Value | Use |
|---|---|---|
| `rounded` | 2px | Buttons, chips, inputs, tags, small tiles |
| `rounded-lg` | 4px | Cards (small), chat bubbles, callouts, popovers |
| `rounded-xl` | 8px | Large cards, mockup frames, pricing cards, CTA banner |
| `rounded-full` | **12px** | See warning below |

> **Warning:** because of the config override, `rounded-full` is **not** a circle. For true circles (avatars, status dots, window-chrome dots) use `rounded-[9999px]`, or define a `circle` radius token in the config and use it everywhere. Fix existing avatars (`w-8 h-8 rounded-full`) and dots.

### 6.2 Borders
- Default: `border border-border-subtle`
- Emphasis: `border-border-strong` (inputs, popovers, dashed placeholders)
- Featured card: `border-2 border-primary-container`
- Dashed (drop zones and CTA banner): `border border-dashed border-border-strong`
- Section dividers: `border-y` or `border-t border-border-subtle`

### 6.3 Shadows

| Level | Value | Use |
|---|---|---|
| none | none | Default |
| `shadow-sm` | Tailwind default | Cards, buttons, badges |
| `shadow-lg` | Tailwind default | Popovers and menus only |
| Hero mockup | `shadow-[0_1px_3px_rgba(15,15,15,0.06),0_9px_24px_rgba(15,15,15,0.06)]` | Large product frame only |

---

## 7. Iconography

- **Material Symbols Outlined**, outline style (`FILL 0`), weight 400, default size **18px**.
- Size helpers: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-[12px]` for inline chips.
- Color: `text-text-secondary` (neutral), `text-text-primary` (emphasis), `text-callout-green-text` (success, e.g. `check_circle`, `verified`), `text-interactive-blue` (interactive or active).
- Add a `data-icon="name"` attribute alongside the text name for tooling.
- Icon tiles: `w-8 h-8 rounded bg-bg-sidebar border border-border-subtle flex items-center justify-center`.
- Emoji are used as lightweight content icons (🧠 📐 🧬 💡 📖) in the app UI and callouts. Do not mix emoji and Material icons within the same control.
- Standard icons: `auto_stories` (brand), `arrow_forward` (CTA), `verified` (grounded or verified), `check_circle` / `check` (feature lists), `quiz`, `neurology`, `link`, `send`, `cloud_upload`.

---

## 8. Components

### 8.1 Header (top nav)
- `bg-bg-canvas border-b border-border-subtle sticky top-0 z-50 w-full`
- Inner: `flex items-center justify-between h-14 px-6 md:px-12 max-w-7xl mx-auto`
- Brand: 24px icon tile + "Synapse" in `font-headline-sm` + small tag `text-[10px] bg-surface-container px-1.5 py-0.5 rounded` ("Study AI")
- Nav links (hidden below `md`): `text-body-md px-2.5 py-1 rounded hover:bg-bg-hover`. Active: `text-notion-black font-medium`. Inactive: `text-text-secondary font-normal`.
- Actions: "Log in" ghost link + "Get Started" primary button with trailing arrow.

### 8.2 Buttons

All buttons: `font-label-md text-label-md rounded transition ... active:scale-[0.98]`. Do not use bold weights beyond 500.

| Variant | Classes |
|---|---|
| **Primary (hero/CTA)** | `bg-primary text-on-primary hover:bg-notion-black px-5 py-2.5 shadow-sm flex items-center gap-2` |
| **Primary (header, compact)** | `bg-primary-container hover:bg-notion-black text-on-primary px-3.5 py-1.5 shadow-sm` |
| **Primary (large CTA banner)** | Primary + `px-6 py-3` |
| **Secondary (outlined)** | `bg-bg-canvas text-text-primary hover:bg-bg-hover border border-border-subtle px-4 py-2.5 shadow-sm` |
| **Secondary (tier card, full width)** | `w-full text-center bg-bg-sidebar hover:bg-bg-hover border border-border-strong text-text-primary py-2.5` |
| **Ghost / text** | `text-text-secondary hover:text-text-primary hover:bg-bg-hover px-3 py-1.5` |
| **Link-button (inline)** | `text-interactive-blue font-medium hover:underline` with trailing icon |
| **Suggestion pill** | `w-full text-left bg-bg-sidebar hover:bg-bg-hover border border-border-subtle px-2.5 py-1.5 text-[11px]`, leading blue icon, trailing chevron |

Keyboard hint inside a button: `font-code text-xs text-text-tertiary bg-surface-container px-1.5 py-0.5 rounded border border-border-subtle`.

Layout: button groups use `flex flex-wrap items-center justify-center gap-3`. Primary buttons carry an icon on the left (e.g. `edit_note`) or right (`arrow_forward`).

### 8.3 Badges, chips & tags
- Base: `font-label-sm text-xs px-2 py-0.5 rounded`
- Variants: Info (`#D3E5EF` / `#18537A`), Success (`#D9F5D6` / `#2B593F`), Neutral (`bg-surface-container text-text-secondary`)
- Eyebrow badge (hero): `inline-flex items-center gap-2 px-3 py-1 rounded border border-border-subtle bg-bg-canvas shadow-sm`, with ✦ glyph, text, a 1px divider, and a blue verified link
- "Most Popular" ribbon: `absolute -top-3 right-6 bg-primary text-on-primary text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider font-semibold`
- Status pill: `text-callout-green-text bg-callout-green px-2 py-0.5 rounded text-[11px]` with a 6px dot
- Section label chip: `font-label-sm bg-surface-container text-text-secondary px-2.5 py-1 rounded inline-block mb-3`
- Mono sync tag: `font-code text-[11px] text-text-tertiary bg-bg-canvas px-2 py-0.5 border border-border-subtle rounded`

### 8.4 Cards
- **Standard card:** `bg-bg-canvas border border-border-subtle rounded-lg p-5 or p-6 shadow-sm`
- **Large / visual card:** `bg-bg-canvas border border-border-subtle rounded-xl p-6 shadow-sm`
- **Metric card:** `p-6 border border-border-subtle rounded-lg bg-bg-canvas text-center`. The number is `font-display text-4xl md:text-5xl font-bold text-notion-black tracking-tight`, followed by `label-md` title and `body-sm` description.
- **Step card:** standard card with a numbered tile (`w-8 h-8 rounded bg-surface-container font-code text-sm font-bold`), title, description, and a footer separated by `border-t border-border-subtle` in `text-xs font-code text-text-tertiary` with a small icon.
- **Testimonial:** italic `body-md` quote, then `pt-3 border-t` footer with initials avatar (32px, `bg-surface-container`, `text-xs font-semibold`), name (`label-md font-semibold`) and role (`text-[11px] text-text-tertiary`).
- **Pricing card:** `rounded-xl p-8`. Standard tier uses `border border-border-subtle`; featured tier uses `border-2 border-primary-container relative`. Includes the tier name with tag, price (`font-display text-4xl font-bold` plus `/ month` in `text-text-secondary text-body-sm`), blurb, a check list, then a full-width button.
- Hover on rows within cards: `hover:bg-surface-container-low transition-colors`.

### 8.5 List rows (documents, sidebar)
- File row: `flex items-center justify-between p-3 rounded bg-bg-sidebar border border-border-subtle hover:bg-surface-container-low`. Left: 32px file-type badge + title (`label-md font-medium`) + meta (`text-[11px] text-text-tertiary`). Right: tag + green `verified` icon.
- Sidebar item: `flex items-center gap-2 px-2 py-1.5 rounded text-text-secondary hover:bg-bg-hover`. Selected: `bg-bg-hover text-text-primary font-medium` (top level) or `bg-bg-active` (document) with a blue 6px dot.
- Nested children: `pl-4 border-l border-border-subtle ml-3`.
- Sidebar section label: `text-[11px] uppercase tracking-wider font-semibold text-text-secondary`.

### 8.6 Feature check lists
`ul.space-y-2` with `li.flex items-center gap-2`: a `check_circle` icon in `text-callout-green-text` and `body-md text-text-primary` text. Pricing lists use `space-y-3`, `body-sm` and the `check` icon.

### 8.7 Inputs
- Text input: `w-full text-xs py-2 pl-3 pr-8 rounded border border-border-strong bg-bg-canvas text-text-primary focus:outline-none focus:border-interactive-blue focus:ring-1 focus:ring-interactive-blue transition-all`
- Trailing icon button (send): `absolute right-1.5 text-text-secondary hover:text-primary p-0.5`
- Helper row under input: `text-[10px] text-text-tertiary` with left/right content.
- Drop zone: `p-2 border border-dashed border-border-strong rounded bg-bg-canvas` with cloud icon and `text-[11px]` hint.

### 8.8 AI Tutor panel and chat
- Panel: `bg-surface p-4`, header with 20px "AI" tile (`bg-primary text-on-primary text-[10px] font-bold rounded`), name, and "Indexed: N docs" meta, separated by `border-b border-border-subtle`.
- User bubble: right-aligned, `bg-bg-canvas border border-border-subtle rounded-lg rounded-tr-none px-3 py-2 text-xs shadow-sm max-w-[90%]`. Meta line: `text-[10px] font-code text-text-tertiary` ("You • 2m ago").
- AI bubble: left-aligned, same style with `rounded-tl-none p-3 space-y-2 max-w-[98%]`. It opens with a green label row (icon + "Tutor Analogy", `text-callout-green-text text-[11px] font-medium`).
- **Citation chip** (required under every AI answer): `inline-flex items-center gap-1 bg-[#D3E5EF] text-[#18537A] hover:bg-interactive-blue hover:text-white px-2 py-0.5 rounded text-[11px] font-code`, with a `link` icon and text such as `[Lecture 4, Slide 18]`. Optionally add a `text-[10px] text-text-tertiary` grounding score next to it.

### 8.9 Editor (notes canvas)
- Title: `text-2xl font-headline-lg font-semibold tracking-tight`
- Meta row: info tag + neutral tag + `• 8 min read`
- Callout: `bg-bg-sidebar border border-border-subtle rounded p-3 flex gap-2.5` with leading emoji and `body-sm` text; bold lead-in word
- Inline highlight: `bg-callout-green/60 px-1 rounded font-medium`
- Inline code: `font-code text-xs bg-surface-container px-1 py-0.5 rounded`
- Quote block: `border-l-2 border-primary-container pl-3` with italic `text-text-secondary` text and a `font-code text-[11px] text-interactive-blue` source line starting with `↳ Source:`
- Toggle list: `arrow_drop_down` icon + label (`font-medium`), nested `list-disc pl-6 text-text-secondary`
- Block math: `bg-bg-sidebar border border-border-subtle p-2.5 rounded font-code text-xs`
- Slash menu: `bg-bg-canvas border border-border-strong rounded-lg shadow-lg p-2 max-w-xs`. The group label is `text-[11px] uppercase tracking-wider text-text-tertiary`. Selected item is `bg-bg-active text-text-primary font-medium` with a blue icon and `⏎` hint; others are `text-text-secondary hover:bg-bg-hover`.

### 8.10 Quiz block
`bg-bg-sidebar border border-border-subtle rounded-lg p-4 space-y-3`.
- Header: `text-xs text-text-secondary` caption in caps plus blue mono context label
- Question: `body-md font-semibold`
- Option: `p-2.5 rounded bg-bg-canvas border border-border-subtle hover:border-interactive-blue text-xs`. A correct option shows a green `check_circle`. Unselected options use `opacity-70` and a mono percentage.
- Footer: `border-t border-border-subtle pt-2.5 text-[11px]` with a source line (left) and a "Verify Source Slide" link-button (right)

### 8.11 App window mockup frame
- Outer: `bg-bg-canvas border border-border-subtle rounded-xl overflow-hidden` with the hero shadow
- Chrome bar: `bg-bg-sidebar border-b border-border-subtle px-4 py-2.5`, three dots, 1px divider, breadcrumb (`label-sm text-text-secondary`, current item `text-text-primary font-medium`), and status pills on the right
- Body min height: `min-h-[460px]`. Scroll areas use `custom-scroll max-h-[520px] overflow-y-auto`.

### 8.12 Trust strip
`border-y border-border-subtle bg-bg-canvas py-8`. Uppercase `label-sm` caption plus logo text items (`font-headline-sm`, icon + name), with `opacity-70 grayscale hover:grayscale-0 transition-all`.

### 8.13 CTA banner
`bg-bg-sidebar border border-border-strong border-dashed rounded-xl p-10 md:p-14 text-center space-y-6`. Emoji, `headline-lg` title (`md:text-3xl`), `body-lg` subtitle, primary + secondary buttons, and a `text-[12px] text-text-tertiary` reassurance line.

### 8.14 Footer
`bg-bg-sidebar border-t border-border-subtle`. Inner: `max-w-7xl mx-auto py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6`. Brand mini-mark, bullet separator, copyright (`body-sm text-text-secondary`). Links in `body-sm text-text-secondary hover:text-text-primary hover:underline`.

---

## 9. Page & Section Patterns

Standard landing-page order: Header, Hero (badge, H1, subtitle, CTAs, product mockup), Trust strip, Feature deep-dives (alternating copy and visual), How it works (3 steps on `bg-bg-sidebar` band), Metrics and testimonials, Pricing, Final CTA, Footer.

**Section intro pattern** (centered): label chip, `headline-lg` H2, `body-lg` or `body-md` description in `text-text-secondary`, `max-w-2xl mx-auto mb-16`.

**Alternating backgrounds:** white/surface page, then `bg-bg-sidebar` bands (`border-y border-border-subtle`) to separate major sections.

**Inner app pages (dashboard, binder, editor, settings):**
- Reuse the three-column workspace layout from the hero mockup: sidebar (`bg-bg-sidebar`), content canvas (`bg-bg-canvas`), contextual panel (`bg-surface`).
- Keep the 56px header with the same brand and nav treatment.
- Page titles use `font-headline-lg`; metadata rows use tags, mono text and `text-text-tertiary`.

---

## 10. Interaction & Motion

- Transitions: `transition-colors duration-150` for hovers; `transition-all duration-100` for buttons with press feedback; `transition-colors` for cards and rows.
- Press: `active:scale-[0.98]` on buttons.
- Hover: neutral surfaces use `bg-bg-hover`; cards and rows use `bg-surface-container-low`; links and citations turn `interactive-blue`.
- Focus: `focus:outline-none focus:border-interactive-blue focus:ring-1 focus:ring-interactive-blue`. Every interactive element needs a visible focus state, so add `focus-visible:` rings to buttons and links too.
- No decorative animation, parallax or gradients. Motion should only confirm interaction.

---

## 11. Dark Mode

The config enables `darkMode: "class"` and a few components include `dark:` variants (header `dark:bg-primary`, footer `dark:bg-inverse-surface`, `dark:text-text-tertiary`, `dark:text-inverse-on-surface`, `dark:text-on-primary`, `dark:border-outline-variant`). Dark mode is **not fully implemented**. When extending it:
- Page background: `inverse-surface` (`#2f3130`); cards `primary` (`#1a1f22`)
- Text: `inverse-on-surface` (`#f1f1ef`); secondary `text-tertiary`
- Borders: `outline-variant`
- Keep blue and green accents, but swap tag backgrounds for darker translucent equivalents
- Test every component in both modes before shipping

---

## 12. Accessibility

- Body text (`text-primary` on white/surface) passes AA. `text-tertiary` (`#9B9A97`) on white does **not** reach 4.5:1, so use it only for non-essential metadata and never for required instructions or critical labels.
- Info and success tag text colors pass AA on their backgrounds.
- Provide `aria-label` on icon-only buttons (send, add, close) and `alt`/`aria-hidden` handling on decorative icons.
- Use semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and keep a single `h1` per page with ordered `h2`/`h3`.
- Don't rely on color alone for state; pair color with an icon (check, verified) or text.
- Minimum tap target 36px for primary actions on mobile. The compact 24px controls in mockups are for illustration only.
- Respect `prefers-reduced-motion` if animations are ever added.

---

## 13. Voice & Content Guidelines

- **Tone:** calm, confident, student-focused; plain language, short sentences. Second person ("your curriculum", "your notes").
- **Headlines:** an outcome plus an editorial flourish. Italicize the key phrase.
- **CTA labels:** verb-first ("Start studying for free", "Get Started", "Start 14-Day Free Trial"). Keep primary CTA copy consistent across pages.
- **Product terms (use consistently):** Study Binder, Synapse Tutor, Scholar Pro, Student Free, active recall, source-grounded.
- **Citations:** format as `[Lecture 4, Slide 18]` or `Source: Author, Title, p. N`.
- **Claims to review before launch:** "zero hallucinations", "0% Hallucination guarantee", "99.8% confidence", testimonial GPAs, named schools and university logos, and "Adopted by Stanford / MIT / Oxford / Berkeley". These are strong claims that need substantiation and permission. Prefer measurable, defensible wording (e.g. "answers cite your source material").
- The copyright footer reads "© 2025"; update it to the current year or generate it dynamically.
- The hero badge currently names "GPT-4o Grounded". Keep model names in one place so they can be updated without redesigning pages.

---

## 14. Do / Don't

**Do**
- Use tokens (`text-text-secondary`, `bg-bg-sidebar`, `border-border-subtle`) rather than raw hex or Tailwind grays.
- Use serif only for display and headline-lg; Inter for everything else; Space Mono for metadata, numbering, shortcuts and code.
- Use 1px subtle borders, small radii, and `shadow-sm` at most.
- Attach a citation chip to every AI-generated claim.
- Keep one primary (dark) button per view region.

**Don't**
- Don't use `rounded-full` expecting a circle (see section 6.1).
- Don't add gradients, glows, bright backgrounds or heavy shadows.
- Don't use blue for non-interactive decoration or green for non-success states.
- Don't mix font families inside one text style, or invent new font sizes outside the scale (except the approved micro sizes).
- Don't introduce new accent colors without adding them to this file.

---

## 15. Quick-Reference Snippets

**Primary button**
```html
<a class="font-label-md text-label-md bg-primary text-on-primary hover:bg-notion-black px-5 py-2.5 rounded shadow-sm flex items-center gap-2 transition-transform duration-100 active:scale-[0.98]" href="#signup">
  <span>Start studying for free</span>
  <span class="material-symbols-outlined">arrow_forward</span>
</a>
```

**Secondary button**
```html
<button class="font-label-md text-label-md text-text-primary bg-bg-canvas hover:bg-bg-hover border border-border-subtle px-4 py-2.5 rounded flex items-center gap-2 shadow-sm transition-colors" type="button">
  <span>Watch 2-min interactive tour</span>
</button>
```

**Card**
```html
<div class="bg-bg-canvas border border-border-subtle rounded-lg p-6 shadow-sm">
  <h3 class="font-headline-sm text-headline-sm text-text-primary font-semibold">Title</h3>
  <p class="font-body-md text-body-md text-text-secondary leading-relaxed">Description</p>
</div>
```

**Section intro**
```html
<div class="text-center max-w-2xl mx-auto mb-16">
  <span class="font-label-sm text-label-sm text-text-secondary bg-surface-container px-2.5 py-1 rounded mb-3 inline-block">Label</span>
  <h2 class="font-headline-lg text-headline-lg text-notion-black tracking-tight mb-4">Headline</h2>
  <p class="font-body-lg text-body-lg text-text-secondary">Supporting copy.</p>
</div>
```

**Info tag / citation chip**
```html
<span class="bg-[#D3E5EF] text-[#18537A] font-label-sm text-xs px-2 py-0.5 rounded">NEUR200</span>
<a class="inline-flex items-center gap-1 bg-[#D3E5EF] text-[#18537A] hover:bg-interactive-blue hover:text-white px-2 py-0.5 rounded text-[11px] font-code transition-colors" href="#">
  <span class="material-symbols-outlined text-[12px]">link</span>[Lecture 4, Slide 18]
</a>
```

**Input**
```html
<input class="w-full text-xs font-body-sm py-2 pl-3 pr-8 rounded border border-border-strong bg-bg-canvas text-text-primary focus:outline-none focus:border-interactive-blue focus:ring-1 focus:ring-interactive-blue transition-all" placeholder="Ask anything about this syllabus..." type="text"/>
```

---

## 16. Appendix: Canonical Tailwind Config

Copy this into every page (or into a shared `tailwind.config.js`). It is the same config used on the landing page.

```js
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary": "#ffffff", "surface-container-lowest": "#ffffff", "outline": "#74777a",
        "on-secondary-container": "#002f59", "surface-container-highest": "#e2e3e1",
        "on-primary-fixed-variant": "#42474b", "interactive-blue-hover": "#0075D4",
        "on-background": "#1a1c1b", "text-tertiary": "#9B9A97", "on-secondary": "#ffffff",
        "surface-container-high": "#e8e8e6", "primary-container": "#2f3437", "surface": "#f9f9f7",
        "border-strong": "rgba(55, 53, 47, 0.16)", "on-error-container": "#93000a",
        "on-secondary-fixed-variant": "#004883", "bg-active": "rgba(55, 53, 47, 0.10)",
        "tertiary-fixed-dim": "#b3ceb0", "inverse-on-surface": "#f1f1ef", "secondary": "#0060ac",
        "surface-dim": "#dadad8", "primary": "#1a1f22", "bg-sidebar": "#F7F7F5",
        "error-container": "#ffdad6", "on-surface-variant": "#44474a", "on-tertiary-container": "#88a287",
        "inverse-surface": "#2f3130", "on-tertiary-fixed": "#09200d", "surface-variant": "#e2e3e1",
        "surface-bright": "#f9f9f7", "tertiary-container": "#213823", "surface-container-low": "#f4f4f2",
        "outline-variant": "#c4c7c9", "secondary-fixed": "#d4e3ff", "callout-green": "#D9F5D6",
        "surface-tint": "#5a5f62", "secondary-container": "#3598fe", "on-surface": "#1a1c1b",
        "on-primary": "#ffffff", "on-error": "#ffffff", "text-secondary": "#787774",
        "bg-hover": "rgba(55, 53, 47, 0.06)", "on-tertiary-fixed-variant": "#354c36",
        "notion-black": "#050505", "secondary-fixed-dim": "#a4c9ff", "border-subtle": "rgba(55, 53, 47, 0.09)",
        "error": "#ba1a1a", "interactive-blue": "#0A85EA", "background": "#f9f9f7",
        "text-primary": "#2F3437", "primary-fixed": "#dfe3e7", "on-secondary-fixed": "#001c39",
        "bg-canvas": "#FFFFFF", "on-primary-container": "#979ca0", "tertiary-fixed": "#ceeacb",
        "callout-green-text": "#2B593F", "tertiary": "#0c2310", "primary-fixed-dim": "#c3c7cb",
        "on-primary-fixed": "#171c1f", "inverse-primary": "#c3c7cb", "surface-container": "#eeeeec"
      },
      borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
      spacing: {
        "space-xs": "0.25rem", "space-sm": "0.5rem", "margin": "1.5rem", "space-md": "0.75rem",
        "space-xl": "2rem", "gutter": "1rem", "space-lg": "1.25rem"
      },
      fontFamily: {
        "headline-lg": ["\"Source Serif 4\""], "body-lg": ["Inter"], "body-sm": ["Inter"],
        "headline-md": ["Inter"], "code": ["Space Mono"], "display": ["\"Source Serif 4\""],
        "label-sm": ["Inter"], "body-md": ["Inter"], "display-mobile": ["\"Source Serif 4\""],
        "headline-lg-mobile": ["\"Source Serif 4\""], "headline-sm": ["Inter"], "label-md": ["Inter"]
      },
      fontSize: {
        "headline-lg": ["34px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "400" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "code": ["13px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "400" }],
        "display": ["44px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "500" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "display-mobile": ["32px", { lineHeight: "38px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-lg-mobile": ["26px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["17px", { lineHeight: "22px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "500" }]
      }
    }
  }
}
```

---

## 17. Change Log

| Version | Notes |
|---|---|
| 1.0 | Initial design system extracted from the Synapse landing page |
