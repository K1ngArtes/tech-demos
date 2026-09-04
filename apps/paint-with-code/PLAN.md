# Paint with Code playground

## Goal

A one-user playground where the artefact is editable p5.brush JavaScript: change a stroke, re-render, and download a watercolor-style PNG.

## Single-user MVP

In:

- Live editor + canvas on one screen
- A few built-in watercolor sketches (peach hibiscus / gold hibiscus / leaves / wildflowers / meadow field)
- Run, reset to the sample, download PNG
- Short explainer that the code is the artefact — not a prompt
- Real `p5.brush` so fills bleed like watercolor, not flat canvas fills

Out:

- Auth, accounts, persistence
- LLM API calls or “write me a painting”
- RL / training loop, judge models, Puppeteer render farm
- Multi-file projects, animation timeline, brush designer

**Fallback:** none. If `p5.brush` will not load, stop — do not fake watercolor with `fill()`.

## Tasks

1. Scaffold Vite + React + TypeScript with Bun, `bunfig.toml`, and shadcn/ui. Set Vite `base: '/paint-with-code/'`.
2. Host a WebGL2 canvas with the official `p5.brush` standalone build; Run evaluates the editor sketch and flushes with `brush.render()`.
3. Ship three floral samples that use `brush.fill` / bleed / texture (and a stroke brush), not native canvas fills.
4. One playground screen: explainer, sample picker, editor, Run / Reset / Download PNG, error surface.
5. No tests or git hooks — the canvas render is the proof.

## Stack

- **Bun** — required runtime, installer, and script runner.
- **Vite + React + TypeScript** (`bunx create-vite`) — one-screen utility; no server or App Router.
- **shadcn/ui** — product chrome (buttons, cards, textarea, tabs) without a custom design system.
- **p5.brush standalone** — official watercolor bleed / texture; no p5 instance-mode wiring.

## Deferred

- Model-in-the-loop generation — this is the playground for that idea, not the trainer.
- Monaco / syntax highlighting — a monospace editor is enough to edit strokes.
- Custom image brush tips — built-in brushes plus watercolor fill cover the look.

## Source

Bookmark: https://x.com/kickingkeys/status/2091570990048276897  
Essay: https://surya.website/rling-qwen-to-paint-with-code
