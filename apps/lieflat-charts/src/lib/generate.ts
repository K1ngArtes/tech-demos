import { escapeHtml } from "./html.ts"
import { rnd } from "./sample.ts"
import { pickRungUnit, rungCount } from "./scale.ts"
import { TEMPLATE_META, type ChartSpec, type DataRow } from "./types.ts"

const INK = "#1C1C1A"
const PAPER = "#F0EFEB"
const MUTED = "#8F8E88"
const FAINT = "#C6C5BF"
const GRID = "#DEDDD6"
const TICK = "#CFCEC7"

function attr(attrs: Record<string, string | number | undefined>): string {
  return Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${String(v)}"`)
    .join(" ")
}

function el(tag: string, attrs: Record<string, string | number | undefined>, body = ""): string {
  return body
    ? `<${tag} ${attr(attrs)}>${body}</${tag}>`
    : `<${tag} ${attr(attrs)}/>`
}

function txt(
  x: number,
  y: number,
  text: string,
  extra: Record<string, string | number | undefined> = {},
): string {
  return el(
    "text",
    {
      x: fix(x),
      y: fix(y),
      "font-family": "Inter, sans-serif",
      fill: extra.fill ?? INK,
      ...extra,
    },
    escapeHtml(text),
  )
}

function fix(n: number): string {
  return n.toFixed(2).replace(/\.00$/, "")
}

function isWeekend(label: string): boolean {
  const iso = /^\d{4}-\d{2}-\d{2}/.exec(label)
  if (!iso) return false
  const day = new Date(`${iso[0]}T00:00:00Z`).getUTCDay()
  return day === 0 || day === 6
}

function shortLabel(label: string, max = 10): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

function axisTrio(rows: DataRow[]): Array<[number, string]> {
  if (rows.length === 1) return [[0, rows[0].label]]
  const mid = Math.floor((rows.length - 1) / 2)
  return [
    [0, rows[0].label],
    [mid, rows[mid].label],
    [rows.length - 1, rows[rows.length - 1].label],
  ]
}

function yScale(values: number[], base: number, height: number): (v: number) => number {
  const min = Math.min(...values, 0)
  const max = Math.max(...values)
  const span = max - min || 1
  return (v: number) => base - ((v - min) / span) * height
}

function peakIndices(values: number[], count: number, minGap: number): number[] {
  const order = values.map((_, i) => i).sort((a, b) => values[b] - values[a])
  const picked: number[] = []
  for (const i of order) {
    if (picked.every((p) => Math.abs(p - i) >= minGap)) picked.push(i)
    if (picked.length === count) break
  }
  return picked
}

function drawRungBars(rows: DataRow[]): { svg: string; caption: string } {
  const max = Math.max(...rows.map((r) => r.value), 0)
  const { unit, caption } = pickRungUnit(max)
  const counts = rows.map((r) => rungCount(r.value, unit))
  const tallest = Math.max(...counts, 1)
  const W = 400
  const H = 320
  const base = 266
  const step = Math.min(5.8, 200 / tallest)
  const slot = 304 / rows.length
  const hw = Math.min(15, slot * 0.32)

  const parts: string[] = []
  rows.forEach((row, i) => {
    const x = 48 + (i + 0.5) * slot
    const n = counts[i]
    for (let k = 0; k < n; k++) {
      const y = base - k * step
      const w = hw - 1.4 + rnd(k + 1, i + 2) * 2.8
      const delay = (i * 0.08 + k * 0.012).toFixed(3)
      parts.push(
        el("line", {
          x1: fix(x - w),
          y1: fix(y),
          x2: fix(x + w),
          y2: fix(y),
          stroke: INK,
          "stroke-width": 1,
          opacity: (0.5 + rnd(k + 2, i + 4) * 0.5).toFixed(2),
          class: "fade",
          style: `animation-delay:${delay}s`,
        }),
      )
      if (k % 5 === 4) {
        parts.push(
          el("circle", {
            cx: fix(x + hw + 4),
            cy: fix(y),
            r: 0.8,
            fill: FAINT,
            class: "fade",
            style: `animation-delay:${delay}s`,
          }),
        )
      }
    }
    const topY = base - Math.max(n - 1, 0) * step
    parts.push(
      txt(x, topY - 10, String(row.value), {
        "font-size": 11,
        "font-weight": 800,
        "text-anchor": "middle",
        class: "fade",
        style: `animation-delay:${(0.4 + i * 0.08).toFixed(2)}s`,
      }),
    )
    parts.push(
      txt(x, base + 18, shortLabel(row.label, 8).toUpperCase(), {
        "font-size": 7.5,
        "font-weight": 700,
        fill: MUTED,
        "text-anchor": "middle",
        "letter-spacing": ".08em",
        class: "fade",
        style: `animation-delay:${(i * 0.08).toFixed(2)}s`,
      }),
    )
  })
  parts.push(
    el("line", {
      x1: 28,
      y1: base + 4,
      x2: 372,
      y2: base + 4,
      stroke: GRID,
      "stroke-width": 0.8,
      class: "fade",
    }),
  )
  parts.push(
    txt(200, 306, `${caption} · DOT MARKS EVERY FIFTH`, {
      "font-size": 7,
      "font-weight": 600,
      fill: "#B0AFA9",
      "text-anchor": "middle",
      "letter-spacing": ".12em",
      class: "fade",
      style: "animation-delay:.9s",
    }),
  )
  return { svg: wrapSvg(W, H, parts.join("")), caption }
}

function drawHairlineLine(rows: DataRow[]): { svg: string; caption: string } {
  const W = 400
  const H = 320
  const base = 262
  const values = rows.map((r) => r.value)
  const map = yScale(values, base, 196)
  const x = (i: number) => 30 + (rows.length === 1 ? 170 : (i / (rows.length - 1)) * 340)
  const peaks = peakIndices(values, 2, 5)
  const parts: string[] = []

  rows.forEach((_, d) => {
    parts.push(
      el("line", {
        x1: fix(x(d)),
        y1: base,
        x2: fix(x(d)),
        y2: base - 7,
        stroke: TICK,
        "stroke-width": 0.6,
        class: "fade",
        style: `animation-delay:${(d * 0.008).toFixed(3)}s`,
      }),
    )
  })
  parts.push(
    el("line", {
      x1: 24,
      y1: base,
      x2: 376,
      y2: base,
      stroke: GRID,
      "stroke-width": 0.8,
      class: "fade",
    }),
  )

  const pts = rows.map((r, d) => `${fix(x(d))} ${fix(map(r.value))}`).join(" L ")
  parts.push(
    el("path", {
      d: `M${pts}`,
      fill: "none",
      stroke: INK,
      "stroke-width": 1,
      "pathLength": 1,
      class: "draw",
      style: "animation-duration:1.2s",
    }),
  )

  rows.forEach((row, d) => {
    const weekend = isWeekend(row.label)
    const big = peaks.includes(d)
    parts.push(
      el("circle", {
        cx: fix(x(d)),
        cy: fix(map(row.value)),
        r: big ? 4.2 : 2.1,
        fill: weekend ? PAPER : INK,
        stroke: INK,
        "stroke-width": weekend ? 1 : 0,
        class: "pop",
        style: `animation-delay:${(0.2 + d * 0.03).toFixed(3)}s`,
      }),
    )
    if (big) {
      parts.push(
        txt(x(d), map(row.value) - 11, String(Math.round(row.value)), {
          "font-size": 9.5,
          "font-weight": 800,
          "text-anchor": "middle",
          style: `paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:${(1 + d * 0.01).toFixed(2)}s`,
          class: "fade",
        }),
      )
    }
  })

  for (const [i, label] of axisTrio(rows)) {
    parts.push(
      txt(x(i), base + 18, shortLabel(label, 12).toUpperCase(), {
        "font-size": 7.5,
        "font-weight": 600,
        fill: MUTED,
        "text-anchor": "middle",
        "letter-spacing": ".08em",
        class: "fade",
      }),
    )
  }

  const caption = rows.some((r) => isWeekend(r.label))
    ? "ONE DOT = ONE DAY · HOLLOW = WEEKEND"
    : "ONE DOT = ONE OBSERVATION · BARCODE FLOOR"
  parts.push(
    txt(200, 306, caption, {
      "font-size": 7,
      "font-weight": 600,
      fill: "#B0AFA9",
      "text-anchor": "middle",
      "letter-spacing": ".12em",
      class: "fade",
      style: "animation-delay:1.1s",
    }),
  )
  return { svg: wrapSvg(W, H, parts.join("")), caption }
}

function drawHairlineArea(rows: DataRow[]): { svg: string; caption: string } {
  const W = 400
  const H = 320
  const base = 262
  const values = rows.map((r) => r.value)
  const map = yScale(values, base, 196)
  const x = (i: number) => 28 + (rows.length === 1 ? 172 : (i / (rows.length - 1)) * 344)
  const peak = values.indexOf(Math.max(...values))
  const parts: string[] = [
    el("line", {
      x1: 22,
      y1: base,
      x2: 378,
      y2: base,
      stroke: GRID,
      "stroke-width": 0.8,
      class: "fade",
    }),
  ]

  rows.forEach((row, d) => {
    const hero = d === peak
    parts.push(
      el("line", {
        x1: fix(x(d)),
        y1: base,
        x2: fix(x(d)),
        y2: fix(map(row.value)),
        stroke: hero ? INK : MUTED,
        "stroke-width": hero ? 1.1 : 0.55,
        opacity: hero ? 1 : (0.5 + rnd(d + 1, 7) * 0.45).toFixed(2),
        class: "fade",
        style: `animation-delay:${(d * 0.014).toFixed(3)}s`,
      }),
    )
  })

  const pts = rows.map((r, d) => `${fix(x(d))} ${fix(map(r.value))}`).join(" L ")
  parts.push(
    el("path", {
      d: `M${pts}`,
      fill: "none",
      stroke: INK,
      "stroke-width": 1.2,
      "pathLength": 1,
      class: "draw",
      style: "animation-delay:.4s;animation-duration:1.2s",
    }),
  )
  parts.push(
    el("circle", {
      cx: fix(x(peak)),
      cy: fix(map(values[peak])),
      r: 4.2,
      fill: INK,
      class: "pop",
      style: "animation-delay:1.2s",
    }),
  )
  parts.push(
    txt(x(peak), map(values[peak]) - 11, String(Math.round(values[peak])), {
      "font-size": 9.5,
      "font-weight": 800,
      "text-anchor": "middle",
      style: `paint-order:stroke;stroke:${PAPER};stroke-width:3px;animation-delay:1.3s`,
      class: "fade",
    }),
  )

  for (const [i, label] of axisTrio(rows)) {
    parts.push(
      txt(x(i), base + 18, shortLabel(label, 12).toUpperCase(), {
        "font-size": 7.5,
        "font-weight": 600,
        fill: MUTED,
        "text-anchor": "middle",
        "letter-spacing": ".08em",
        class: "fade",
      }),
    )
  }

  const caption = "ONE HAIRLINE = ONE DAY, FLOOR TO PEAK"
  parts.push(
    txt(200, 306, caption, {
      "font-size": 7,
      "font-weight": 600,
      fill: "#B0AFA9",
      "text-anchor": "middle",
      "letter-spacing": ".12em",
      class: "fade",
      style: "animation-delay:1.3s",
    }),
  )
  return { svg: wrapSvg(W, H, parts.join("")), caption }
}

function wrapSvg(w: number, h: number, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img">${inner}</svg>`
}

function pageCss(): string {
  return `
:root{--bg:${PAPER};--ink:${INK};--muted:${MUTED};--faint:${FAINT};--grid:${GRID}}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);font-family:'Inter',sans-serif;color:var(--ink);padding:48px 28px 32px;-webkit-font-smoothing:antialiased}
.card{max-width:720px;margin:0 auto;background:var(--bg);border-radius:24px;padding:28px 28px 20px}
.badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.08em;padding:3px 10px;border-radius:99px;margin-bottom:12px;border:1px dashed #B0AFA9;color:#8F8E88}
h1{font-weight:700;font-size:19px;letter-spacing:-.02em;margin-bottom:4px;line-height:1.25}
.sub{font-size:11.5px;color:var(--muted);margin-bottom:16px;line-height:1.5}
.src{font-size:9.5px;color:var(--faint);margin-top:12px;letter-spacing:.08em;font-weight:500}
svg{width:100%;max-height:360px;display:block;margin:0 auto;cursor:pointer}
svg text{font-family:'Inter',sans-serif}
.note{max-width:720px;margin:18px auto 0;font-size:10px;color:#B0AFA9;letter-spacing:.04em;text-align:center;line-height:1.6}
.pop{transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.2,.7,.3,1.3) both}
@keyframes pop{from{transform:scale(0)}to{transform:none}}
.fade{animation:fade .9s ease both}
@keyframes fade{from{opacity:0}}
.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1s cubic-bezier(.4,0,.2,1) both}
@keyframes draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){
  .pop,.fade{animation:none}
  .draw{animation:none;stroke-dasharray:none;stroke-dashoffset:0}
}
`.trim()
}

export function generateChartHtml(spec: ChartSpec): string {
  const drawn =
    spec.template === "bar"
      ? drawRungBars(spec.rows)
      : spec.template === "line"
        ? drawHairlineLine(spec.rows)
        : drawHairlineArea(spec.rows)

  const meta = TEMPLATE_META[spec.template]
  const title = escapeHtml(spec.title.trim() || meta.name)
  const subtitle = escapeHtml(spec.subtitle.trim() || meta.hint)
  const source = escapeHtml(spec.source.trim() || "SOURCE UNSPECIFIED").toUpperCase()

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>${pageCss()}</style>
</head>
<body>
<article class="card" id="chart">
  <p class="badge">${escapeHtml(meta.badge)}</p>
  <h1>${title}</h1>
  <p class="sub">${subtitle}</p>
  <div class="chart">${drawn.svg}</div>
  <p class="src">${source}</p>
</article>
<p class="note">Single-file HTML · Mono editorial look · click the chart to replay<br/>Noncommercial playground of the Lieflat Charts visual language · PolyForm Noncommercial 1.0.0</p>
<script>
(function(){
  var svg=document.querySelector('svg');
  if(!svg) return;
  function replay(){
    var clone=svg.cloneNode(true);
    svg.parentNode.replaceChild(clone,svg);
    svg=clone;
    svg.addEventListener('click',replay);
  }
  svg.addEventListener('click',replay);
})();
</script>
</body>
</html>
`
}
