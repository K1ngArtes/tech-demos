export type SampleId = "hibiscus" | "leaves" | "wildflowers"

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
}

export const SAMPLE_ORDER: SampleId[] = ["hibiscus", "leaves", "wildflowers"]
