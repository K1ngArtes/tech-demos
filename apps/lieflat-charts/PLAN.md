# Lieflat Charts playground

## Goal

A one-user playground that turns pasted CSV/JSON (or a built-in sample) into a downloadable single-file HTML chart in the Lieflat Mono editorial look, using Lupi Basics bar / line / area only.

## Single-user MVP

In:

- Paste CSV or JSON, or load a built-in sample that matches the selected template
- Pick one Lupi Basics silhouette: F1 Rung Bars, F2 Hairline Line, F3 Hairline Area
- Live preview of a standalone HTML page (paper, Inter, hairlines, countable units)
- Download that page as a single `.html` file
- One screen, no auth

Out:

- Agent runtime, SKILL.md execution, or cloning the upstream repo into `apps/`
- Lupi Editorial L1–L20, remaining Basics F4–F17, Glance, maps, interactive big charts
- Report-mode templates (R01–R12) and color presets (Porcelain / Palm / Wire)
- Multi-series, column mapping UI, accounts, persistence, publishing

**Fallback:** none. F1/F2/F3 cover the approved chart types as handwritten SVG. Glance / maps / interactive / Chart.js / ECharts are not used.

## Tasks

1. Scaffold a Vite + React + TypeScript app with Bun, `bunfig.toml`, and shadcn/ui.
2. Parse pasted CSV/JSON into `{ label, value }[]` with a clear error if the table has no labels or numbers.
3. Generate original single-file HTML (card: conclusion title · subtitle · SVG · uppercase source) in the Mono visual language — rungs for bars, hairline + day dots for lines, floor-to-peak hairlines for area.
4. One playground screen: data, template, copy fields, preview iframe, download.
5. Tests for parse + HTML generation only; no git hooks.

## Stack

- **Bun** — required runtime, installer, and script runner.
- **Vite + React + TypeScript** (`bunx create-vite`) — one-screen utility; no App Router or server needed.
- **shadcn/ui** — product chrome (textarea, select, buttons, cards) without a custom design system.
- **Handwritten SVG in generated HTML** — matches Lupi Basics (countable units, no chart-library defaults).
- **`bun:test`** — parse and generator only.

## License

Upstream [lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts) is PolyForm Noncommercial 1.0.0. This playground is a noncommercial demo. Do not vendor the repo. Tokens and chart grammar are reimplemented from the public skill/catalog; generated HTML is original work in that visual language. See `NOTICE.md`.

## Deferred

- Other catalog templates, color presets, report mode — outside the approved MVP.
- Agent-driven template audit — this is a human playground, not a skill runner.
- Persistence / multi-chart pages — one chart, one file is the whole product.

## Source

Bookmark: https://x.com/Zhiyu333/status/2094719194302706136  
Upstream: https://github.com/larashero3-dotcom/lieflat-charts
