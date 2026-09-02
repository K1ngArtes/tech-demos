import { describe, expect, test } from "bun:test"
import { generateChartHtml } from "./generate.ts"
import { escapeHtml, slugify } from "./html.ts"
import { pickRungUnit, rungCount } from "./scale.ts"
import type { ChartSpec } from "./types.ts"

const spec = (over: Partial<ChartSpec> = {}): ChartSpec => ({
  template: "bar",
  title: "Revenue by plan",
  subtitle: "one rung = $1k",
  source: "billing",
  rows: [
    { label: "FREE", value: 38 },
    { label: "PRO", value: 22 },
  ],
  ...over,
})

describe("generateChartHtml", () => {
  test("emits a single-file HTML document with the Mono card", () => {
    const html = generateChartHtml(spec())
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true)
    expect(html).toContain("Revenue by plan")
    expect(html).toContain("<svg")
    expect(html).toContain("BILLING")
    expect(html).toContain("#F0EFEB")
    expect(html).toContain("#1C1C1A")
    expect(html).toContain("F1 RUNG BARS")
  })

  test("escapes copy so pasted titles cannot break the file", () => {
    const html = generateChartHtml(
      spec({ title: `<script>alert(1)</script>` }),
    )
    expect(html).not.toContain("<script>alert(1)</script>")
    expect(html).toContain(escapeHtml("<script>alert(1)</script>"))
  })

  test("line and area templates include a hairline path", () => {
    const line = generateChartHtml(
      spec({
        template: "line",
        rows: [
          { label: "2026-06-01", value: 10 },
          { label: "2026-06-02", value: 20 },
          { label: "2026-06-06", value: 14 },
        ],
      }),
    )
    expect(line).toContain("F2 HAIRLINE LINE")
    expect(line).toContain("path")
    expect(line).toContain("HOLLOW = WEEKEND")

    const area = generateChartHtml(spec({ template: "area" }))
    expect(area).toContain("F3 HAIRLINE AREA")
    expect(area).toContain("FLOOR TO PEAK")
  })
})

describe("scale", () => {
  test("keeps small integers as one rung per unit", () => {
    expect(pickRungUnit(38).unit).toBe(1)
    expect(rungCount(38, 1)).toBe(38)
  })

  test("scales large values down to a countable ladder", () => {
    const { unit } = pickRungUnit(38000)
    expect(38000 / unit).toBeLessThanOrEqual(40)
    expect(rungCount(38000, unit)).toBeGreaterThan(0)
  })
})

describe("slugify", () => {
  test("builds a download stem", () => {
    expect(slugify("Revenue by plan, rung by rung")).toBe(
      "revenue-by-plan-rung-by-rung",
    )
  })
})
