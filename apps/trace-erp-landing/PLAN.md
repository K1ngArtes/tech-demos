# Trace ERP landing

## Goal
Port the Origin Next.js Trace ERP marketing page into a self-contained Vite SPA under `apps/trace-erp-landing/` for Cloudflare Pages sticky demos at `/trace-erp-landing/`.

## MVP
- 1:1 copy from `src/lib/copy.ts`
- All marketing sections: hero, problem, product, how-it-works, audience, closing
- Sticky header, footer, mailto CTAs
- Dark Trace visual language (oklch tokens, hero atmosphere)
- `bun install && bun run build` → `dist/index.html`
- Vite `base: '/trace-erp-landing/'`

## Stack
- Vite + React + TypeScript + Tailwind v4 + shadcn (matches sibling demos)
- Bun only; bunfig.toml with minimumReleaseAge = 259200

## Out of scope
- Next.js / App Router / Vercel
- Editing CI or other apps
