# Timeline Feature — Design Spec

**Date:** 2026-03-31
**Status:** Approved

---

## Overview

A dedicated `/timeline` page that lets users scroll horizontally through the release history of all open source models (LLM, Diffusion, Audio). Time flows left-to-right; the scroll snaps to each month column. The page fits entirely within the viewport height — all scrolling is horizontal only.

---

## Route & Navigation

- **Route:** `/timeline`
- **Sidebar entry:** Added between Compare and the bottom of the nav; icon: `Clock` (lucide-react); label: `TIMELINE`

---

## Page Layout (3 horizontal zones, no vertical scroll)

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Title + Category Filters + Progress Bar     │  ~80px fixed
├─────────────────────────────────────────────────────┤
│  RULER: Year labels + Month tick marks               │  ~80px, scrolls with cards
├─────────────────────────────────────────────────────┤
│  CARDS: Month columns, model cards stacked vertically│  fills remaining height
└─────────────────────────────────────────────────────┘
```

The ruler and cards area share a single horizontally scrollable container so they always scroll in sync. `overflow-x: auto`, `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`.

---

## Header Bar

- Page label: `CHRONOLOGICAL INDEX` in monospaced uppercase with blinking cursor
- Three category toggle chips (toggleable on/off):
  - **LLM** — `primary` color (#DFFF00 Cyber Lime)
  - **Diffusion** — `secondary-container` color (#FFBF00 Electric Amber)
  - **Audio** — `#00BFFF` (Deep Sky / teal accent, consistent with audio pages)
- A thin progress bar (2px, `primary` color) spanning the full header width, showing horizontal scroll position. Updates on scroll via JS.

---

## Timeline Ruler

- Fixed height ~80px, scrolls horizontally with the cards container
- **Year markers:** Large `display-sm` monospaced text in `primary`, placed at the leftmost column of each new year. Year boundary visually emphasized with a taller tick or a vertical line extending into the cards area.
- **Month labels:** `label-sm` monospaced uppercase (e.g. `JAN`, `FEB`) rendered above each month column. Color: `outline-variant`.
- A horizontal baseline runs across the full ruler at the bottom, in `outline-variant/30`.

---

## Month Columns (Cards Area)

### Column structure
- Each month from the earliest model release to the latest (2020-09 through 2025-03) gets a column.
- Column width: `280px` for months that contain visible models; `80px` for empty months (narrow spacer with a dashed center line in `outline-variant/20`).
- Each column is a `scroll-snap-align: start` snap target.
- Columns with models display a small count badge at the top: e.g. `3 MODELS` in monospaced `label-sm`.

### Model cards within a column
Cards stack vertically within the column with `gap-3`. Each card:

| Element | Style |
|---|---|
| Model name | `font-display font-bold text-sm text-white` |
| Creator | `font-mono text-xs text-gray-400` |
| Category badge | Colored chip (LLM=lime, Diffusion=amber, Audio=teal), `label-sm` monospaced |
| Params | `font-mono text-xs text-gray-300` |
| Key benchmark | MMLU-Pro (LLM), CLIP Score (Diffusion), WER (Audio) — `font-mono text-xs text-primary` or `—` |
| View link | `View →` in `font-mono text-xs` linking to `/models/[category]/[id]` |

Card background: `surface-low`. Stats block: `surface-highest`. Border: `outline-variant/10`. Corner decoration: small `border-t border-r border-outline-variant/40` triangle at top-right. Hover: `surface-high`.

### Filtering behavior
When a category is toggled off, its cards are hidden (`display: none`) but the column structure is preserved — months do not reflow. Empty months resulting from filtering show the narrow spacer style.

---

## Data Layer

- Source: `data/models.json` (all three categories)
- All processing happens at the component level (client component, `"use client"`)
- Models are grouped by `releaseDate` year+month (`YYYY-MM` key)
- Month range is computed from `min(releaseDate)` to `max(releaseDate)` across **all categories always** (not affected by filter state), padded to full years at each end — so the axis never shifts when toggling categories
- No new data files needed

---

## New Files

| File | Purpose |
|---|---|
| `app/timeline/page.tsx` | Main timeline page (client component) |

No new shared components needed — card UI is self-contained in the page file for now.

---

## Sidebar Update

`components/Sidebar.tsx` — add one nav item:
```ts
{ name: "Timeline", href: "/timeline", icon: Clock }
```

---

## Design System Compliance

- No standard borders — tonal shifts and structural framing only
- No soft shadows — bloom glows (`drop-shadow` with `primary` at low opacity) on active states
- Monospaced font for all data values, dates, counts
- `scroll-snap` gives the machine-like intentional feel consistent with Kinetic Mainframe aesthetic
- Corner decorations on cards match existing `ModelCard` pattern
- No pill/full-radius shapes — `rounded-sm` or `rounded` only

---

## Out of Scope

- No animation of cards entering as you scroll (keep it simple)
- No date range slider/filter
- No keyboard navigation beyond native scroll
- Audio category third-color accent is fixed at `#00BFFF` — no theming toggle
