# EduFlow — Design System

The shared visual language for the whole EduFlow client. The landing page
(`src/components/eduflow/`) is the reference implementation; **everything below is
already wired up and works on any page** — colours, fonts, and component classes
are global. Use them; don't invent new ones.

Defined in: `tailwind.config.js` (colours + `font-display`) and `src/index.css`
(CSS tokens + component classes).

---

## 1. Colours (Tailwind utilities — work everywhere)

| Token    | Use it for                                  | Example utilities                              |
| -------- | ------------------------------------------- | ---------------------------------------------- |
| `linen`  | page background (warm cream)                | `bg-linen`                                     |
| `clay`   | faint panels, dividers, muted surfaces      | `bg-clay`                                       |
| `card`   | cards / raised surfaces (near-white warm)   | `bg-card`                                       |
| `ink`    | all text (warm charcoal, never pure black)  | `text-ink`, `text-ink/85`, `text-ink/60`       |
| `sky`    | **trust / links / primary actions** (blue)  | `text-sky`, `bg-sky`                            |
| `meadow` | **success / positive / “done”** (green)     | `text-meadow`, `bg-meadow`                      |
| `honey`  | a *whisper* of highlight only (yellow)      | underline accents, never text colour           |
| `muted`  | labels & captions                           | `text-muted-foreground`                         |
| `border` | hairlines / input borders                   | `border border-border`                          |

Opacity modifiers work on all of them (`text-ink/85`, `bg-linen/70`, `border-border/40`).
Inline styles can use the raw CSS vars: `style={{ color: 'var(--sky)' }}`,
`var(--meadow)`, `var(--ink)`, `var(--linen)`, `var(--clay)`, `var(--honey)`.

---

## 2. Typography

- **Display / headings:** add `font-display` (General Sans). Sizes: `text-2xl`
  (card titles) → `text-4xl sm:text-5xl` (section headings) → `text-6xl/7xl` (hero).
- **Body:** default font (Inter). `text-ink/85`, `leading-relaxed` (~1.7).
- **Eyebrow / label:** `text-xs uppercase tracking-[0.18em] text-muted-foreground`.
- **Numbers:** add `tabular-nums`.
- **Accent a single word** in a heading by wrapping it:
  `<em className="not-italic" style={{ color: 'var(--sky)' }}>child</em>`.

---

## 3. Components (global CSS classes)

```jsx
// Card — warm, soft shadow, 1px paper-cut corners
<div className="paper-card p-6">…</div>

// Buttons — softly debossed "paper" buttons (≥44px tall already)
<Link className="btn-paper btn-primary" to="/register">Get started</Link>
<Link className="btn-paper btn-ghost" to="/login">Log in</Link>

// Frosted sticky header
<header className="nav-frosted …">…</header>

// Hand-drawn divider (not a flat rule)
<div className="pencil-divider opacity-50" />

// Gentle entrance animations
className="animate-rise"    // rises 8px + fades in
className="animate-breath"  // fades in with a soft blur (headlines)
className="animate-float"   // slow idle float (loops)
```

Inputs (non-HeroUI): `bg-card border border-border rounded-xl px-4 py-3
focus:outline-none focus:ring-2 focus:ring-sky`.

**HeroUI pages (Login / Register / dashboards):** HeroUI's `primary` = sky,
`success` = meadow, `warning` = honey are already configured, so existing
`<Button color="primary">` etc. are on-brand. Just give each page root
`min-h-screen bg-linen text-ink` and switch headings to `font-display`. For full
consistency you can swap HeroUI buttons for `btn-paper`.

---

## 4. Non-negotiables (do not break these)

- **Never red.** Errors / destructive states use warm charcoal (`text-ink` or
  `text-muted-foreground`), never red.
- **No “late”, “missing”, “behind”, “overdue”** wording — anywhere, ever.
- **Warm shadows only** (use `.paper-card` / `var(--shadow-paper)`). No cool
  grey/blue shadows.
- **Touch targets ≥ 44px.** Respect `prefers-reduced-motion` (animations fade).
- No stock photos of children — line illustration only.

---

## 5. Paste-ready prompt for a teammate / Codex

> Restyle `<FILE PATH>` to match the EduFlow design system in
> `client/DESIGN-SYSTEM.md`. **Do not change any logic, props, routes, state, or
> API calls — only styling/markup.**
>
> Use only existing tokens/classes (never invent colours):
> - Page root: `min-h-screen bg-linen text-ink`.
> - Cards / panels: `paper-card`.
> - Primary action: `btn-paper btn-primary`; secondary: `btn-paper btn-ghost`.
> - Headings: `font-display text-ink` (`text-2xl`…`text-5xl`); body: `text-ink/85
>   leading-relaxed`; labels: `text-xs uppercase tracking-[0.18em]
>   text-muted-foreground`.
> - Accents: `text-sky` for links/trust, `text-meadow` for success/positive.
> - Inputs: `bg-card border border-border rounded-xl … focus:ring-2 focus:ring-sky`.
> - Colours available: linen, clay, card, ink, sky, meadow, honey, muted-foreground, border.
>
> Rules: never red (errors in warm charcoal); no “late/missing/behind” wording;
> warm shadows only; touch targets ≥44px; respect reduced motion. If the page uses
> HeroUI, keep the components but set the page background/typography and prefer
> `color="primary"`/`"success"`/`"warning"`.
>
> Return the full restyled file only.
