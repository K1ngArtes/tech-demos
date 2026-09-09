# Stop-Motion Lab

## Goal

A one-user lab that turns a subject prompt (or a reference still) plus a motion prompt into a short looping stop-motion GIF via chained GPT-Image 2.5 generate → edit hops (Flare by default, Sunburst optional) — locally via Vite middleware and on the public Pages site via Cloudflare Pages Functions.

## Single-user MVP

In:

- One screen: subject + motion prompts, Flare / Sunburst toggle (default Flare), frame-count slider, FPS, Generate / Stop
- Hard frame cap: default 8, min 4, max 16 (slider + server clamp — cannot exceed 16)
- Frame 1: Images API generate with the selected model (`gpt-image-2.5-flare` or `gpt-image-2.5-sunburst`), or an uploaded/pasted reference still
- Frames 2…N: Images API edit of the previous frame with the same allowlisted model; instruction keeps character/camera identical and applies only the next micro-motion
- Server allowlists only those two model ids — arbitrary client strings are 400
- Filmstrip + playhead scrubber, play loop, download GIF and a zip of frames
- `OPENAI_API_KEY` lives only on the server: local `.env`, or Cloudflare Pages → Settings → Environment variables (Production **and** Preview). Never `VITE_*`, never the browser, never GitHub Actions secrets
- Public production generate: repo-root Pages Functions at `/api/status`, `/api/generate`, `/api/edit` reuse the same handler as `bun run dev`. No password, Access gate, or `DEMO_PASSWORD`

Out:

- Auth, accounts, persistence, database
- Audio, video models, timeline editors, onion-skinning
- Abuse gates / rate limits (spend is capped by the user’s OpenAI billing limit plus the 16-frame clamp)

**Validation fallback:** when the key is missing (or `STUB_OPENAI=1`), the same handler returns canned stub PNGs so the UI does not crash. Production without a Pages secret stays in stub mode; with `OPENAI_API_KEY` set in Pages, live generate/edit for the selected model.

## Tasks

1. Scaffold Vite + React + TypeScript with Bun, `bunfig.toml`, and shadcn/ui. Set Vite `base: '/stop-motion-lab/'`.
2. Shared Bun/Vite API: `POST /api/generate` and `POST /api/edit` hold the key; clamp frame counts; allowlisted Flare or Sunburst + `quality: low` + `1024x1024` PNG. Stub frames when no key.
3. One lab screen: prompts, Flare / Sunburst toggle (default Flare), 4–16 frame slider (default 8), FPS, optional reference still, Generate / Stop, progress, filmstrip + playhead, loop, GIF + zip.
4. Tests for frame-cap clamp, model allowlist, edit-prompt builder, and the JSON API contract only; no git hooks.
5. Repo-root Cloudflare Pages Functions (`functions/api/`) call the same `handleApi` + OpenAI helpers. Combined `dist/` build writes `_routes.json` so `/api/*` is Functions and SPA `_redirects` never swallow those paths. `wrangler pages deploy dist` picks up `./functions` from the repo root.

## Stack

- **Bun** — required runtime, installer, and script runner.
- **Vite + React + TypeScript** (`bunx create-vite`) — one-screen utility; a Vite middleware plugin plus an optional Bun.serve sidecar keep the key off the browser.
- **shadcn/ui** — product chrome (slider, buttons, cards, textarea) without a custom design system.
- **OpenAI Images API** (`gpt-image-2.5-flare` default, `gpt-image-2.5-sunburst` selectable) — generate then chained edit.
- **Cloudflare Pages Functions** — public `/api/*` on the combined tech-demos site; env from Pages, not Actions.
- **gifenc + JSZip** — client-side GIF and frame-zip; no video pipeline.
- **`bun:test`** — clamp + prompt builder + API contract only.

## Deferred

- Higher quality / larger sizes than `quality: low` + `1024x1024` — spend and latency; Sunburst is selectable but still uses the same size/quality bound.
- Soft rate limits / passwords — user asked them skipped; OpenAI spend limit is the cost control.
- Multi-shot stories, audio, onion skin, video export — outside the approved cut.

## Source

Bookmark: https://x.com/charlierguo/status/2097399137142772071
