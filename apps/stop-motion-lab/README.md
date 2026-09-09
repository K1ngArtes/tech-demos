# Stop-Motion Lab

Single-user MVP that chains GPT-Image 2.5 Flare generate → edit hops into a short looping stop-motion GIF. Inspired by [Charlie Guo](https://x.com/charlierguo/status/2097399137142772071).

Frame 1 is an Images API **generate** (or an uploaded/pasted still). Frames 2…N **edit** the previous PNG so only the next micro-motion lands. Hard cap: **4–16 frames, default 8**.

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
| `POST /api/generate` | Frame 1 · `gpt-image-2.5-flare` · `quality: low` · `1024x1024` PNG |
| `POST /api/edit` | Frames 2…N · previous PNG + motion instruction |

If `OPENAI_API_KEY` is missing, or `STUB_OPENAI=1`, the server returns canned bouncing-ball PNGs so the UI can be exercised without image credits. The client→server→OpenAI wiring is still the live path when a key is present.

## Production (Cloudflare Pages)

The combined tech-demos Pages site hosts this SPA at `/stop-motion-lab/`. That build is **static** — generate/edit is local-only (`bun run dev` or `bun run start`). A Pages secret named `OPENAI_API_KEY` would only matter if a Function were added later; this MVP does not ship one.

`gpt-image-2.5-sunburst` is documented as the slower precision editor and is **not** required.

## Spend bound

The frame slider cannot exceed 16. The server rejects `frameCount` outside 4–16.
