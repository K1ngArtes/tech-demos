import { describe, expect, test } from "bun:test"
import { parseTable, validateRows } from "./parse.ts"

describe("parseTable", () => {
  test("reads CSV with a header row", () => {
    const result = parseTable("plan,mrr\nFREE,38\nPRO,22\n")
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.format).toBe("csv")
    expect(result.rows).toEqual([
      { label: "FREE", value: 38 },
      { label: "PRO", value: 22 },
    ])
  })

  test("reads JSON objects", () => {
    const result = parseTable(
      JSON.stringify([
        { name: "A", count: 4 },
        { name: "B", count: 9 },
      ]),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.format).toBe("json")
    expect(result.rows).toEqual([
      { label: "A", value: 4 },
      { label: "B", value: 9 },
    ])
  })

  test("reads { labels, values }", () => {
    const result = parseTable(
      JSON.stringify({ labels: ["x", "y"], values: [1, 2] }),
    )
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.rows).toEqual([
      { label: "x", value: 1 },
      { label: "y", value: 2 },
    ])
  })

  test("rejects empty input", () => {
    const result = parseTable("   ")
    expect(result.ok).toBe(false)
  })

  test("rejects invalid JSON", () => {
    const result = parseTable('{"oops"')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain("JSON")
  })
})

describe("validateRows", () => {
  test("rejects negatives", () => {
    const result = validateRows(
      [
        { label: "a", value: 1 },
        { label: "b", value: -2 },
      ],
      "bar",
    )
    expect(result.ok).toBe(false)
  })

  test("caps long series for line charts", () => {
    const rows = Array.from({ length: 80 }, (_, i) => ({
      label: String(i),
      value: i,
    }))
    const result = validateRows(rows, "line")
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.rows).toHaveLength(60)
  })
})
