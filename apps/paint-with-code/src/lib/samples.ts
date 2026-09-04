export type SampleId = "hibiscus" | "gold" | "leaves" | "wildflowers" | "meadow"

export type Sample = {
  id: SampleId
  name: string
  blurb: string
  code: string
}

export const SAMPLES: Record<SampleId, Sample> = {
  hibiscus: {
    id: "hibiscus",
    name: "Hibiscus",
    blurb: "Five overlapping watercolor petals, a dark throat, and a staminal column.",
    code: `// Peach hibiscus — change a color or radius, then Run
brush.seed(11)
brush.angleMode(brush.DEGREES)

const petals = [
  { x: -16, y: -78, r: 96, c: "#e07a5f" },
  { x: 70, y: -22, r: 92, c: "#d8572a" },
  { x: 54, y: 68, r: 94, c: "#c23b22" },
  { x: -58, y: 62, r: 90, c: "#e3926a" },
  { x: -84, y: -12, r: 93, c: "#d96a4a" },
]

for (const petal of petals) {
  brush.fill(petal.c, 86)
  brush.fillBleed(0.44, "out")
  brush.fillTexture(0.62, 0.48)
  brush.noStroke()
  brush.circle(petal.x, petal.y, petal.r, true)
}

brush.fill("#5c1a16", 110)
brush.fillBleed(0.22)
brush.fillTexture(0.35, 0.28)
brush.noStroke()
brush.circle(4, 8, 32)

brush.fill("#3f5a38", 78)
brush.fillBleed(0.38)
brush.fillTexture(0.5, 0.34)
brush.circle(-168, 88, 64, true)
brush.circle(-132, 118, 42, true)

brush.set("marker", "#f0d2a8", 1.5)
brush.line(2, 10, 10, -108)
brush.set("crayon", "#f6e7c3", 0.85)
for (let i = 0; i < 8; i++) {
  const a = (-80 + i * 18) * Math.PI / 180
  brush.line(8, -100, 8 + Math.cos(a) * 26, -100 + Math.sin(a) * 12)
}

brush.set("charcoal", "#2f3d2a", 0.7)
brush.line(-150, 40, -168, 88)
`,
  },
  gold: {
    id: "gold",
    name: "Gold",
    blurb: "One yellow hibiscus on black: five petal lobes, a lopsided crimson heart, stamen to the lower left.",
    code: `// Yellow hibiscus on black — edit a petal offset, then Run
brush.seed(7)
brush.angleMode(brush.DEGREES)
brush.clear("#000000")

const cx = 36
const cy = 8

brush.noStroke()
brush.wash("#5a6c52", 28)
brush.circle(-178, 4, 70)
brush.circle(-150, 48, 54)
brush.circle(-196, 64, 40)
brush.noWash()

const petals = [
  { x: cx + 78, y: cy - 16, r: 96, c: "#f4d44c" },
  { x: cx + 42, y: cy - 82, r: 88, c: "#ecd64e" },
  { x: cx - 36, y: cy - 78, r: 84, c: "#e2c440" },
  { x: cx - 86, y: cy + 6, r: 90, c: "#d9b234" },
  { x: cx - 38, y: cy + 80, r: 92, c: "#f0ce46" },
]

for (const p of petals) {
  brush.wash(p.c, 225)
  brush.noStroke()
  brush.circle(p.x, p.y, p.r)
  brush.circle((p.x + cx) / 2, (p.y + cy) / 2, p.r * 0.58)
  brush.wash("#c9a028", 36)
  brush.circle((p.x * 2 + cx) / 3, (p.y * 2 + cy) / 3, p.r * 0.34)
}
brush.noWash()

brush.wash("#e07030", 80)
brush.noStroke()
brush.circle(cx - 4, cy + 6, 28)
brush.wash("#d45a28", 55)
brush.circle(cx - 14, cy + 14, 16)
brush.noWash()

const hearts = [
  [-6, 4, 20, 210, "#c23028"],
  [10, 2, 16, 175, "#b42822"],
  [2, 14, 15, 150, "#9a1c18"],
  [-14, 8, 12, 95, "#d44838"],
  [12, 12, 10, 80, "#8a1814"],
  [-4, -8, 11, 110, "#6e1010"],
  [8, -6, 8, 70, "#e06048"],
  [-10, -4, 7, 50, "#a02820"],
]
for (const [dx, dy, r, a, c] of hearts) {
  brush.wash(c, a)
  brush.noStroke()
  brush.circle(cx + dx, cy + dy, r)
}
brush.noWash()

brush.wash("#120404", 230)
brush.noStroke()
brush.circle(cx, cy + 4, 8)
brush.circle(cx + 5, cy + 1, 5)
brush.noWash()

brush.set("2H", "#d8c898", 0.55)
brush.line(cx + 36, cy - 40, cx + 70, cy - 118)
brush.line(cx + 48, cy + 6, cx + 132, cy + 14)
brush.line(cx - 30, cy - 36, cx - 58, cy - 112)

brush.set("crayon", "#c47818", 2.5)
brush.line(cx - 10, cy + 20, cx - 48, cy + 68)
brush.line(cx - 48, cy + 68, cx - 102, cy + 122)
brush.set("marker", "#e89428", 1.1)
brush.line(cx - 16, cy + 26, cx - 106, cy + 128)
brush.wash("#e07020", 200)
brush.noStroke()
brush.circle(cx - 108, cy + 132, 4.5)
brush.wash("#d45a20", 150)
brush.circle(cx - 70, cy + 90, 3)
brush.circle(cx - 90, cy + 112, 2.8)
brush.noWash()
`,
  },
  leaves: {
    id: "leaves",
    name: "Leaves",
    blurb: "A pair of overlapping washes with charcoal veins.",
    code: `// Leaf study — nudge a circle to reshape the foliage
brush.seed(4)
brush.angleMode(brush.DEGREES)

brush.fill("#6d8b4e", 82)
brush.fillBleed(0.4, "out")
brush.fillTexture(0.58, 0.4)
brush.noStroke()
brush.circle(-40, -20, 110, true)
brush.fill("#3f5a32", 74)
brush.circle(30, 18, 96, true)
brush.fill("#8aa35f", 70)
brush.circle(-90, 50, 58, true)
brush.fill("#2f4a2c", 68)
brush.circle(86, -48, 46, true)

brush.set("charcoal", "#2a3324", 0.9)
brush.line(-120, 70, 110, -80)
brush.line(-40, 10, -90, -50)
brush.line(10, -6, 70, 40)
brush.line(-8, 20, -60, 80)
brush.set("HB", "#4a3b28", 0.7)
brush.line(-130, 90, 120, -90)
`,
  },
  wildflowers: {
    id: "wildflowers",
    name: "Wildflowers",
    blurb: "Three stems and loose watercolor heads — a simple floral bunch.",
    code: `// Wildflowers — swap a head color or add another stem
brush.seed(21)
brush.angleMode(brush.DEGREES)

const stems = [
  { x: -70, y: 150, hx: -90, hy: -70, c: "#c23b55" },
  { x: 8, y: 160, hx: 16, hy: -110, c: "#e0a23a" },
  { x: 78, y: 146, hx: 100, hy: -40, c: "#3d6b8a" },
]

for (const stem of stems) {
  brush.set("pen", "#3a4a32", 1.1)
  brush.line(stem.x, stem.y, stem.hx, stem.hy)

  brush.fill("#4f6a3c", 72)
  brush.fillBleed(0.3)
  brush.fillTexture(0.45, 0.3)
  brush.noStroke()
  brush.circle((stem.x + stem.hx) / 2 - 22, (stem.y + stem.hy) / 2, 28, true)

  brush.fill(stem.c, 90)
  brush.fillBleed(0.46, "out")
  brush.fillTexture(0.6, 0.42)
  brush.circle(stem.hx, stem.hy, 46, true)
  brush.fill(stem.c, 70)
  brush.circle(stem.hx + 18, stem.hy - 10, 30, true)
}

brush.fill("#d7c3a3", 50)
brush.fillBleed(0.2)
brush.circle(0, 170, 80)
`,
  },
  meadow: {
    id: "meadow",
    name: "Meadow",
    blurb: "Dark moss ground, scattered red hearts of mixed intensity, yellow blooms around.",
    code: `// Night meadow — edit a bloom's mint/coral, then Run
brush.seed(9)
brush.angleMode(brush.DEGREES)
brush.clear("#0c140a")

const blooms = [
  { x: -170, y: -168, s: 1.16, mint: "#eaf4ee", coral: "#b44a3e" },
  { x: -18, y: -186, s: 1.08, mint: "#f4faf6", coral: "#c45c4c" },
  { x: 150, y: -156, s: 1.2, mint: "#e2efe6", coral: "#9e3830" },
  { x: -186, y: -22, s: 1.12, mint: "#e8f2ea", coral: "#b85244" },
  { x: -12, y: -18, s: 1.32, mint: "#f6fbf8", coral: "#c86858" },
  { x: 158, y: 8, s: 1.12, mint: "#dceee3", coral: "#a84438" },
  { x: -158, y: 118, s: 1.16, mint: "#e4f0e8", coral: "#b45648" },
  { x: 22, y: 148, s: 1.1, mint: "#eef6f0", coral: "#c06050" },
  { x: 172, y: 128, s: 1.02, mint: "#e0eee4", coral: "#9c3c34" },
  { x: 82, y: -88, s: 1.0, mint: "#eaf4ee", coral: "#b85042" },
  { x: -88, y: 52, s: 1.04, mint: "#f0f7f2", coral: "#a8483c" },
  { x: 92, y: 52, s: 0.98, mint: "#e6f2ea", coral: "#c46a58" },
]

for (const b of blooms) {
  brush.fill(b.mint, 118)
  brush.fillBleed(0.46, "out")
  brush.fillTexture(0.48, 0.36, false)
  brush.noStroke()
  brush.circle(b.x - 24 * b.s, b.y - 16 * b.s, 62 * b.s, true)
  brush.circle(b.x + 22 * b.s, b.y - 14 * b.s, 58 * b.s, true)
  brush.circle(b.x + 2 * b.s, b.y + 20 * b.s, 60 * b.s, true)
}

const heartSpots = [
  [-40, 18, 9, 112],
  [38, -22, 7, 74],
  [14, 42, 10, 56],
  [-44, -24, 5.5, 42],
  [42, 22, 8, 88],
]

for (let i = 0; i < blooms.length; i++) {
  const b = blooms[i]
  const ca = Math.cos(i * 0.55)
  const sa = Math.sin(i * 0.55)
  for (const [dx, dy, r, a] of heartSpots) {
    brush.wash(b.coral, a)
    brush.noStroke()
    brush.circle(b.x + (dx * ca - dy * sa) * b.s, b.y + (dx * sa + dy * ca) * b.s, r * b.s)
  }
  brush.noWash()
}

const goldSpots = [
  [22, 6, 5, 100],
  [-16, 26, 4, 72],
]
for (let i = 0; i < blooms.length; i++) {
  const b = blooms[i]
  const ca = Math.cos(i * 0.55 + 0.8)
  const sa = Math.sin(i * 0.55 + 0.8)
  for (const [dx, dy, r, a] of goldSpots) {
    brush.wash("#e8cc58", a)
    brush.noStroke()
    brush.circle(b.x + (dx * ca - dy * sa) * b.s, b.y + (dx * sa + dy * ca) * b.s, r * b.s)
  }
  brush.noWash()
}

const yellows = [
  { x: 8, y: 210, r: 40 },
  { x: 220, y: -78, r: 34 },
  { x: -220, y: 86, r: 36 },
  { x: 40, y: -210, r: 32 },
]
for (const y of yellows) {
  brush.wash("#e2c84e", 78)
  brush.noStroke()
  brush.circle(y.x, y.y, y.r)
  brush.wash("#f0d878", 55)
  brush.circle(y.x + 12, y.y - 10, y.r * 0.4)
  brush.noWash()
}

const twigs = [
  [-230, 80, -150, -90],
  [-78, 230, -30, 64],
  [32, 236, 74, 88],
  [148, 96, 200, -22],
  [-56, -74, 10, -176],
  [86, -44, 134, -154],
]
brush.set("pen", "#0a0e08", 0.8)
for (const [x1, y1, x2, y2] of twigs) brush.line(x1, y1, x2, y2)

brush.wash("#edc94a", 230)
brush.noStroke()
const pollen = [
  [-150, -90], [-144, -98], [-158, -82],
  [-30, 64], [-24, 56], [-36, 72],
  [74, 88], [80, 80], [68, 94],
  [200, -22], [206, -30], [192, -14],
  [10, -176], [16, -182], [4, -168],
  [134, -154], [140, -160],
]
for (const [x, y] of pollen) brush.circle(x, y, 3.5)
brush.noWash()
`,
  },
}

export const SAMPLE_ORDER: SampleId[] = [
  "hibiscus",
  "gold",
  "leaves",
  "wildflowers",
  "meadow",
]
