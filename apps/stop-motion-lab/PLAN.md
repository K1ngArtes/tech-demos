# Stop-Motion Lab

## Goal

A one-user lab that turns a subject prompt (or a reference still) plus a motion prompt into a short looping stop-motion GIF via chained GPT-Image 2.5 Flare generate → edit hops.

## Single-user MVP

In:

- One screen: subject + motion prompts, frame-count slider, FPS, Generate / Stop
- Hard frame cap: default 8, min 4, max 16 (slider + server clamp — cannot exceed 16)
- Frame 1: Images API generate with `gpt-image-2.5-flare`, or an uploaded/pasted reference still
- Frames 2…N: Images API edit of the previous frame; instruction keeps character/camera identical and applies only the next micro-motion
- Filmstrip + playhead scrubber, play loop, download GIF and a zip of frames
- `OPENAI_API_KEY` via `.env` / `.env.example` — key lives only on the server

Out:

- Auth, accounts, persistence, database
- Audio, video models, timeline editors, onion-skinning
- `gpt-image-2.5-sunburst` as a required path (documented only)
- Cloudflare Pages Functions / production generate (combined Pages site is static)

**Validation fallback:** no `OPENAI_API_KEY` in this cloud env. Real client → Bun/Vite route → OpenAI generate/edit wiring ships. When the key is missing (or `STUB_OPENAI=1`), the server returns canned stub PNGs so the UI can be recorded without spending image credits. Label that path in the UI and this plan. Prefer a real Flare call when a key is present.

## Tasks

1. Scaffold Vite + React + TypeScript with Bun, `bunfig.toml`, and shadcn/ui. Set Vite `base: '/stop-motion-lab/'`.
2. Bun/Vite API: `POST /api/generate` and `POST /api/edit` hold the key; clamp frame counts; Flare + `quality: low` + `1024x1024` PNG. Stub frames when no key.
3. One lab screen: prompts, 4–16 frame slider (default 8), FPS, optional reference still, Generate / Stop, progress, filmstrip + playhead, loop, GIF + zip.
4. Tests for frame-cap clamp and edit-prompt builder only; no git hooks.

## Stack

- **Bun** — required runtime, installer, and script runner.
- **Vite + React + TypeScript** (`bunx create-vite`) — one-screen utility; a Vite middleware plugin plus an optional Bun.serve sidecar keep the key off the browser.
- **shadcn/ui** — product chrome (slider, buttons, cards, textarea) without a custom design system.
- **OpenAI Images API** (`gpt-image-2.5-flare`) — generate then chained edit; Sunburst is deferred.
- **gifenc + JSZip** — client-side GIF and frame-zip; no video pipeline.
- **`bun:test`** — clamp + prompt builder only.

## Deferred

- Sunburst / higher quality / larger sizes — spend and latency; Flare + `quality: low` is the MVP bound.
- Pages Functions for production generate — the monorepo’s combined Pages build is static HTML under `/stop-motion-lab/`. Generation is `bun run dev` (or `bun run start` after build) with a local key. A Pages secret would only matter if a Function were added later.
- Multi-shot stories, audio, onion skin, video export — outside the approved cut.

## Source

Bookmark: https://x.com/charlierguo/status/2097399137142772071
