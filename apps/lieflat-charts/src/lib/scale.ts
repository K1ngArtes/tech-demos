const NICE = [
  0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1_000,
  2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000,
]

export function formatUnit(unit: number): string {
  if (unit >= 1_000_000) return `${trimNum(unit / 1_000_000)}M`
  if (unit >= 1_000) return `${trimNum(unit / 1_000)}k`
  return String(unit)
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "")
}

/** Choose a rung size so the tallest bar stays in a countable 8–36 range. */
export function pickRungUnit(maxValue: number): { unit: number; caption: string } {
  if (!(maxValue > 0)) return { unit: 1, caption: "ONE RUNG = 1" }
  let unit = NICE[NICE.length - 1]
  for (const n of NICE) {
    if (maxValue / n <= 40) {
      unit = n
      break
    }
  }
  return { unit, caption: `ONE RUNG = ${formatUnit(unit)}` }
}

export function rungCount(value: number, unit: number): number {
  if (value <= 0) return 0
  return Math.max(1, Math.round(value / unit))
}
