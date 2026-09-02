# Lieflat Charts playground

Single-user demo of [lieflat-charts](https://github.com/larashero3-dotcom/lieflat-charts): paste CSV/JSON, pick a Lupi Basics template (bar / line / area), download a single-file HTML chart in the Mono editorial look.

Noncommercial. See `NOTICE.md` and `PLAN.md`.

## Run

Local (Vite `base` is `/lieflat-charts/` so assets match Pages):

```bash
bun install
bun run dev
```

Open **http://localhost:5173/lieflat-charts/** — not the site root.

Live (Cloudflare Pages project `tech-demos`): **https://tech-demos.pages.dev/lieflat-charts/**

`bun test` covers parse + HTML generation.
