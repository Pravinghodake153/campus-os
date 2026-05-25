# CampusOS AI — UI Design Rules

## Philosophy

Clean, minimal, professional. The admin web app should feel like a modern enterprise SaaS command center — think Linear, Vercel Dashboard, or GPay business console. Not a neon gaming UI.

---

## Color System

### Base Palette (Dark Mode)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0f1117` | Page background |
| `--bg-surface` | `#161820` | Card/panel surfaces |
| `--bg-surface-hover` | `#1c1e2a` | Hovered cards/rows |
| `--bg-elevated` | `#1e2030` | Elevated panels, modals |
| `--border-subtle` | `#ffffff0a` | Subtle borders (6% white) |
| `--border-default` | `#ffffff14` | Default borders (8% white) |
| `--text-primary` | `#f1f1f3` | Primary text |
| `--text-secondary` | `#9ca3af` | Secondary/label text |
| `--text-muted` | `#6b7280` | Muted/disabled text |

### Accent Color

Use **one** main accent color: `#3b82f6` (blue-500).

- Active nav items, primary buttons, selected tabs, links.
- Never use multiple accent colors competing for attention.

### Status Colors (Use ONLY for status indicators)

| Status | Color | Token |
|---|---|---|
| Success / Safe | `#22c55e` (green-500) | `--status-success` |
| Warning / Attention | `#f59e0b` (amber-500) | `--status-warning` |
| Danger / Critical | `#ef4444` (red-500) | `--status-danger` |
| Info / Neutral | `#6b7280` (gray-500) | `--status-info` |

**Rules:**
- Green/amber/red are ONLY for badges, status dots, risk levels, attendance thresholds.
- Never use them as background fills for cards or large areas.
- Use them at reduced opacity for subtle background tints (e.g., `bg-red-500/10` for a high-risk row).

---

## Cards & Surfaces

### Card Style: `soft-surface`

```css
.soft-surface {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  /* No heavy shadows, no glow, no blur */
}
```

- Cards are **borderless-feeling** — borders are barely visible (6–8% white opacity).
- Elevation is communicated through **background shade difference**, not drop shadows.
- No `backdrop-blur`, no `glassmorphism`, no `glow-border`.

### Hover State

```css
.soft-surface:hover {
  background: var(--bg-surface-hover);
  border-color: var(--border-default);
  transition: all 150ms ease;
}
```

---

## Typography

- Font: **Inter** (Google Fonts)
- Weights: 400 (body), 500 (labels/nav), 600 (headings), 700 (metrics)
- No gradient text. No glow text.
- Use `text-primary` for headings, `text-secondary` for labels, `text-muted` for hints.

---

## Animations & Transitions

### Allowed

- `transition: all 150ms ease` — hover states, card interactions.
- `transition: opacity 200ms ease` — fade-in on page/data load.
- Smooth number counting on metric cards (subtle, 500ms).

### Forbidden

- `pulse-glow`, `neon-border`, `gradient-shift` animations.
- Heavy entrance animations (slide-in, bounce, scale).
- Any animation that draws attention away from data.

---

## Icons

- Library: `lucide-react`
- Size: 16px (inline), 20px (nav), 24px (feature icons)
- Color: `text-secondary` by default, `text-primary` on active
- Never colorful — icons follow text color, except status icons matching status colors.

---

## Layout Rules

1. **Sidebar**: Fixed, 240px expanded / 64px collapsed. Dark surface, no heavy glass.
2. **Top Bar**: Sticky, 56px height. Contains campus/branch filters and user menu.
3. **Content Area**: Max-width 1400px centered, 24px padding, 24px gap between sections.
4. **Cards Grid**: Use consistent gaps (16px or 24px). Metric cards in 4-column grid.

---

## Component Naming

Use these CSS utility class names:

| ✅ Use | ❌ Don't Use |
|---|---|
| `soft-surface` | `glass-card` |
| `subtle-elevation` | `glow-border` |
| `minimal-accent` | `gradient-text` |
| `calm-status` | `pulse-glow` |
| `surface-hover` | `neon-hover` |

---

## Do's and Don'ts

### ✅ Do

- Keep data density high — this is an admin tool, not a landing page.
- Use consistent spacing and alignment.
- Show loading skeletons during data fetch.
- Show empty states with helpful messages.
- Make status instantly scannable via small color badges/dots.

### ❌ Don't

- Don't use more than one accent color.
- Don't apply gradients to backgrounds, cards, or text.
- Don't use glassmorphism/blur effects.
- Don't add decorative elements that don't convey data.
- Don't use heavy borders or outlines on cards.
- Don't use neon or high-saturation colors at full opacity on large surfaces.
