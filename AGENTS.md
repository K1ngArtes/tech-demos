# Agent instructions

This is the sticky tech-demos monorepo. Never create a new GitHub repository for a demo.

## Layout

- `apps/<kebab-slug>/` — one self-contained demo per pick
- `skills/project-planning/` — vendored planning skill; write `apps/<slug>/PLAN.md` before coding
- `tracking/seen-bookmarks.json` — proposed / skipped / built bookmark ids. Do not re-propose listed items.

## Rules for cloud agents

1. Only add or update `apps/<kebab-slug>/` (plus `PLAN.md` inside that folder). Do not edit other apps, CI, or tracking unless the task says so.
2. Plan first with `skills/project-planning/`. Favor Bun, official `bunx create-*` scaffolds, and shadcn/ui. Include a root `bunfig.toml` in the app with `[install] minimumReleaseAge = 259200` before `bun install`.
3. The app must be self-contained: `bun install && bun run dev` from `apps/<slug>/`.
4. Open exactly one PR.
5. Attach **both** at least one screenshot **and** at least one video of the running app in the PR. Not optional.
6. Do not post to X, send email, or message Slack.
