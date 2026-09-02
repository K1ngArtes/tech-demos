# tech-demos

Sticky Bun monorepo for weekday tech demos. One app per pick under `apps/<slug>/`.

Each app is self-contained (`bun install && bun run dev`). Cloud agents only touch that app folder, open one PR, and attach a screenshot plus a video of the running app.

One Cloudflare Pages project (`tech-demos`) hosts every app under `/<slug>/`. Production deploys on `main`; preview deploys on pull requests. See `.github/workflows/pages.yml`.

See `AGENTS.md`.
