import type { ChartCopy, ChartTemplate } from "./types.ts"

/** Deterministic 0–1, same family as the public Mono token `rnd`. */
export function rnd(i: number, k: number): number {
  return Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000
}

function csv(header: string, rows: Array<[string, number]>): string {
  return [header, ...rows.map(([l, v]) => `${l},${v}`)].join("\n")
}

function juneSignups(): Array<[string, number]> {
  const rows: Array<[string, number]> = []
  for (let d = 0; d < 30; d++) {
    const day = String(d + 1).padStart(2, "0")
    const value = Math.round(
      46 + 22 * Math.sin(d / 4.6) + 14 * Math.sin(d / 2.1) + rnd(d + 1, 5) * 12,
    )
    rows.push([`2026-06-${day}`, value])
  }
  return rows
}

function concurrentUsers(): Array<[string, number]> {
  const rows: Array<[string, number]> = []
  const start = Date.UTC(2026, 4, 1)
  for (let d = 0; d < 45; d++) {
    const date = new Date(start + d * 86400000)
    const iso = date.toISOString().slice(0, 10)
    const value = Math.round(
      34 + 26 * Math.sin(d / 7.2) + 12 * Math.sin(d / 2.8) + rnd(d + 1, 3) * 16,
    )
    rows.push([iso, value])
  }
  return rows
}

export const SAMPLES: Record<ChartTemplate, { csv: string; copy: ChartCopy }> = {
  bar: {
    csv: csv("plan,mrr_k", [
      ["FREE", 38],
      ["STARTER", 27],
      ["PRO", 22],
      ["TEAM", 16],
      ["SCALE", 11],
      ["ENT", 7],
    ]),
    copy: {
      title: "Revenue by plan, rung by rung",
      subtitle: "one rung = one $k of MRR · the bar is a ladder you can count",
      source: "SAMPLE BILLING · LIEFLAT PLAYGROUND",
    },
  },
  line: {
    csv: csv("day,signups", juneSignups()),
    copy: {
      title: "Thirty days of sign-ups",
      subtitle: "one dot = one day · hollow = weekend · the barcode floor keeps the calendar honest",
      source: "SAMPLE GROWTH · LIEFLAT PLAYGROUND",
    },
  },
  area: {
    csv: csv("day,users", concurrentUsers()),
    copy: {
      title: "Concurrent users, filled with days",
      subtitle: "one hairline = one day, floor to peak · the area is made of days, not paint",
      source: "SAMPLE LIVE OPS · LIEFLAT PLAYGROUND",
    },
  },
}
