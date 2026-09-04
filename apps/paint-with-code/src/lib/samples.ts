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
    blurb: "One yellow hibiscus on black: five lobes, a scattered crimson heart, thin stamen.",
    code: `// Yellow hibiscus on black — edit a petal angle, then Run
brush.seed(7)
brush.angleMode(brush.DEGREES)
brush.clear("#000000")

const cx = 40
const cy = 10

brush.wash("#6a7c58", 58)
brush.noStroke()
brush.circle(-176, 6, 96)
brush.wash("#4e5e44", 40)
brush.circle(-148, 78, 70)
brush.noWash()

function petalPts(ang, len, halfW) {
  const a = (ang * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const px = -sa
  const py = ca
  const pts = []
  const n = 16
  for (const side of [1, -1]) {
    const seq = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const env = Math.pow(Math.sin(t * Math.PI), 0.62)
      const widen = 0.22 + 0.78 * Math.pow(t, 0.48)
      const ruf = 1 + 0.07 * (random() - 0.5)
      const w = halfW * env * widen * ruf
      seq.push([
        cx + ca * len * t + side * px * w,
        cy + sa * len * t + side * py * w,
      ])
    }
    if (side === 1) pts.push(...seq)
    else pts.push(...seq.reverse())
  }
  return pts
}

const petals = [
  { a: 8,   len: 168, w: 78, c: "#f4d44c" },
  { a: 76,  len: 150, w: 72, c: "#ecd64e" },
  { a: 152, len: 144, w: 70, c: "#d9b234" },
  { a: 224, len: 162, w: 76, c: "#f0ce46" },
  { a: 298, len: 154, w: 74, c: "#e8c43c" },
]

brush.noStroke()
for (const p of petals) {
  brush.wash(p.c, 225)
  brush.polygon(petalPts(p.a, p.len, p.w))
  brush.wash("#c9a028", 48)
  brush.polygon(petalPts(p.a + 3, p.len * 0.72, p.w * 0.55))
}
brush.noWash()

brush.set("crayon", "#b89028", 2.2)
for (const p of petals) {
  const rad = (p.a * Math.PI) / 180
  brush.line(
    cx + Math.cos(rad) * 20,
    cy + Math.sin(rad) * 20,
    cx + Math.cos(rad) * p.len * 0.78,
    cy + Math.sin(rad) * p.len * 0.78,
  )
}

brush.set("pen", "#e8dcc0", 0.5)
const rays = [
  { a: -98, L: 178 },
  { a: -36, L: 152 },
  { a: 14, L: 186 },
  { a: 128, L: 138 },
]
for (const ray of rays) {
  const rad = (ray.a * Math.PI) / 180
  let x = cx + random(-7, 7)
  let y = cy + random(-7, 7)
  for (let i = 1; i <= 5; i++) {
    const t = i / 5
    const nx = cx + Math.cos(rad) * ray.L * t + random(-6, 6)
    const ny = cy + Math.sin(rad) * ray.L * t + random(-6, 6)
    brush.line(x, y, nx, ny)
    x = nx
    y = ny
  }
}

brush.wash("#e07030", 92)
brush.noStroke()
brush.circle(cx + 2, cy + 4, 32)
brush.wash("#d45a28", 64)
brush.circle(cx - 14, cy + 16, 20)
brush.noWash()

const hearts = [
  [-12, 8, 26, 205, "#c23028"],
  [22, -10, 18, 140, "#9a1c18"],
  [-28, -6, 15, 78, "#d44838"],
  [8, 24, 20, 160, "#b42822"],
  [30, 14, 11, 70, "#e06048"],
  [-8, -20, 13, 95, "#8a1814"],
  [4, 6, 17, 120, "#6e1010"],
  [-22, 22, 10, 58, "#a02820"],
]
for (const [dx, dy, r, a, c] of hearts) {
  brush.wash(c, a)
  brush.noStroke()
  brush.circle(cx + dx, cy + dy, r)
}
brush.noWash()

brush.wash("#140404", 220)
brush.noStroke()
brush.circle(cx - 2, cy + 6, 9)
brush.circle(cx + 6, cy + 2, 6)
brush.noWash()

brush.set("crayon", "#c47818", 3.2)
brush.line(cx - 8, cy + 18, cx - 54, cy + 72)
brush.line(cx - 54, cy + 72, cx - 112, cy + 128)
brush.set("marker", "#e89428", 1.35)
brush.line(cx - 14, cy + 24, cx - 118, cy + 136)
brush.wash("#e07020", 205)
brush.noStroke()
brush.circle(cx - 118, cy + 140, 5.5)
for (const t of [0.55, 0.72, 0.86, 0.96]) {
  brush.wash("#d45a20", 165)
  brush.circle(cx - 8 - 110 * t, cy + 18 + 122 * t, 3.2)
}
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
