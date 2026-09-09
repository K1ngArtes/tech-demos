# Stop-Motion Lab

Single-user MVP that chains GPT-Image 2.5 generate → edit hops into a short looping stop-motion GIF. Inspired by [Charlie Guo](https://x.com/charlierguo/status/2097399137142772071).

Frame 1 is an Images API **generate** (or an uploaded/pasted still). Frames 2…N **edit** the previous PNG so only the next micro-motion lands. Pick **Flare** (`gpt-image-2.5-flare`, default — cheaper/faster) or **Sunburst** (`gpt-image-2.5-sunburst`, higher quality/cost) before Generate. The server allowlists only those two ids. Hard cap: **4–16 frames, default 8**.

## Run

```bash
cp .env.example .env   # add OPENAI_API_KEY for live Flare calls
bun install
bun run dev
```

Open **http://localhost:5173/stop-motion-lab/** — not the site root.

`bun run dev` is Vite plus a server-side `/api/generate` and `/api/edit` plugin. The key never leaves the server.

After `bun run build`, `bun run start` serves `dist/` and the same API on port 5173.

## API

| Route | Role |
| --- | --- |
| `GET /api/status` | `openai` vs `stub` |
| `POST /api/generate` | Frame 1 · allowlisted `model` (default Flare) · `quality: low` · `1024x1024` PNG |
| `POST /api/edit` | Frames 2…N · previous PNG + motion instruction · same `model` |

The client calls origin-absolute `/api/*` (not `/stop-motion-lab/api/*`). Local Vite middleware, `bun run start`, and Cloudflare Pages Functions all run the same `server/handle.ts` contract.

If `OPENAI_API_KEY` is missing, or `STUB_OPENAI=1`, the server returns canned bouncing-ball PNGs so the UI can be exercised without image credits. The client→server→OpenAI wiring is still the live path when a key is present.

## Production (Cloudflare Pages)

The combined tech-demos site hosts this SPA at [https://tech-demos-6tg.pages.dev/stop-motion-lab/](https://tech-demos-6tg.pages.dev/stop-motion-lab/). Generate/edit on that origin are **public Pages Functions** (`functions/api/` at the repo root) — no password, no Cloudflare Access, no `DEMO_PASSWORD`.

### Add the OpenAI secret (required for live Flare)

The key is **not** a GitHub Actions secret and must not be prefixed `VITE_`.

1. Cloudflare Dashboard → **Workers & Pages** → project **`tech-demos`**
2. **Settings** → **Environment variables**
3. Add `OPENAI_API_KEY` for **Production** and again for **Preview**
4. Redeploy (or merge to `main` / open a new preview) so the Functions pick up the binding

Until that Pages variable is set, `/api/status` reports `stub` and Generate still works with canned frames (the UI does not hard-crash). After it is set, `/api/status` reports `openai` and Generate calls the selected model.

PR preview deployments stay in stub mode until the **Preview** variable exists. Production (`https://tech-demos-6tg.pages.dev/stop-motion-lab/`) stays in stub until the **Production** variable exists.

Cost control is the user’s OpenAI spend limit plus the hard 4–16 frame clamp. Sunburst costs more per image than Flare.

## Spend bound

The frame slider cannot exceed 16. The server rejects `frameCount` outside 4–16.
