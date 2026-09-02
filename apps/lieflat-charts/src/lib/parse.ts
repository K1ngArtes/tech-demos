import { LIMITS, type ChartTemplate, type DataRow, type ParseResult } from "./types.ts"

const LABEL_KEYS = [
  "label",
  "name",
  "category",
  "plan",
  "day",
  "date",
  "x",
  "month",
  "week",
] as const

const VALUE_KEYS = [
  "value",
  "count",
  "amount",
  "mrr",
  "mrr_k",
  "signups",
  "users",
  "y",
  "n",
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const cleaned = value.replace(/[$,\s]/g, "").replace(/%$/, "")
    if (cleaned === "") return null
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function asLabel(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === "string") {
    const t = value.trim()
    return t ? t : null
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return null
}

function pickKey(
  row: Record<string, unknown>,
  preferred: readonly string[],
  test: (v: unknown) => boolean,
): string | null {
  const keys = Object.keys(row)
  for (const name of preferred) {
    const match = keys.find((k) => k.toLowerCase() === name)
    if (match && test(row[match])) return match
  }
  return keys.find((k) => test(row[k])) ?? null
}

function rowsFromObjects(records: Record<string, unknown>[]): DataRow[] | null {
  if (records.length === 0) return []
  const sample = records[0]
  const labelKey = pickKey(sample, LABEL_KEYS, (v) => asLabel(v) !== null)
  const valueKey = pickKey(
    sample,
    VALUE_KEYS,
    (v) => asNumber(v) !== null && (labelKey == null || v !== sample[labelKey]),
  )
  if (!labelKey || !valueKey || labelKey === valueKey) return null

  const rows: DataRow[] = []
  for (const rec of records) {
    const label = asLabel(rec[labelKey])
    const value = asNumber(rec[valueKey])
    if (label == null || value == null) continue
    rows.push({ label, value })
  }
  return rows
}

function rowsFromPairs(items: unknown[]): DataRow[] | null {
  const rows: DataRow[] = []
  for (const item of items) {
    if (!Array.isArray(item) || item.length < 2) return null
    const label = asLabel(item[0])
    const value = asNumber(item[1])
    if (label == null || value == null) continue
    rows.push({ label, value })
  }
  return rows
}

function parseJson(text: string): ParseResult {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: "JSON is not valid. Check commas and quotes." }
  }

  if (isRecord(data) && Array.isArray(data.data)) data = data.data

  if (isRecord(data) && Array.isArray(data.labels) && Array.isArray(data.values)) {
    const rows: DataRow[] = []
    const n = Math.min(data.labels.length, data.values.length)
    for (let i = 0; i < n; i++) {
      const label = asLabel(data.labels[i])
      const value = asNumber(data.values[i])
      if (label == null || value == null) continue
      rows.push({ label, value })
    }
    if (rows.length === 0) {
      return { ok: false, error: "JSON labels/values did not yield any numeric rows." }
    }
    return { ok: true, rows, format: "json" }
  }

  if (!Array.isArray(data) || data.length === 0) {
    return {
      ok: false,
      error: "JSON should be an array of { label, value } objects, [label, value] pairs, or { labels, values }.",
    }
  }

  if (data.every((item) => isRecord(item))) {
    const rows = rowsFromObjects(data as Record<string, unknown>[])
    if (!rows || rows.length === 0) {
      return {
        ok: false,
        error: "Could not find a text column and a numeric column in the JSON objects.",
      }
    }
    return { ok: true, rows, format: "json" }
  }

  if (data.every((item) => Array.isArray(item))) {
    const rows = rowsFromPairs(data)
    if (!rows || rows.length === 0) {
      return { ok: false, error: "JSON pairs need a label and a number in each row." }
    }
    return { ok: true, rows, format: "json" }
  }

  if (data.every((item) => asNumber(item) !== null)) {
    const rows = data.map((item, i) => ({
      label: String(i + 1),
      value: asNumber(item) as number,
    }))
    return { ok: true, rows, format: "json" }
  }

  return { ok: false, error: "Unrecognized JSON shape." }
}

function detectDelimiter(firstLine: string): string {
  const counts = [
    { d: "\t", n: firstLine.split("\t").length },
    { d: ";", n: firstLine.split(";").length },
    { d: ",", n: firstLine.split(",").length },
  ]
  counts.sort((a, b) => b.n - a.n)
  return counts[0].n > 1 ? counts[0].d : ","
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === delimiter && !inQuotes) {
      out.push(cur.trim())
      cur = ""
      continue
    }
    cur += ch
  }
  out.push(cur.trim())
  return out
}

function parseCsv(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"))
  if (lines.length === 0) {
    return { ok: false, error: "Paste a table, or load a sample." }
  }

  const delimiter = detectDelimiter(lines[0])
  const cells = lines.map((line) => splitCsvLine(line, delimiter))
  const width = Math.max(...cells.map((r) => r.length))
  if (width < 2) {
    return { ok: false, error: "CSV needs at least two columns: a label and a number." }
  }

  const firstValue = asNumber(cells[0][1])
  const hasHeader = firstValue == null
  const start = hasHeader ? 1 : 0
  const rows: DataRow[] = []

  for (let i = start; i < cells.length; i++) {
    const row = cells[i]
    const label = asLabel(row[0])
    const value = asNumber(row[1])
    if (label == null || value == null) continue
    rows.push({ label, value })
  }

  if (rows.length === 0) {
    return { ok: false, error: "No numeric rows found. Use label,value columns." }
  }
  return { ok: true, rows, format: "csv" }
}

export function parseTable(input: string): ParseResult {
  const text = input.trim()
  if (!text) return { ok: false, error: "Paste a table, or load a sample." }
  if (text.startsWith("{") || text.startsWith("[")) return parseJson(text)
  return parseCsv(text)
}

export function validateRows(
  rows: DataRow[],
  template: ChartTemplate,
): { ok: true; rows: DataRow[] } | { ok: false; error: string } {
  if (rows.some((r) => r.value < 0)) {
    return {
      ok: false,
      error: "Rung Bars, Hairline Line, and Hairline Area expect non-negative values.",
    }
  }
  const { min, max } = LIMITS[template]
  if (rows.length < min) {
    return {
      ok: false,
      error: `${LIMITS[template] === LIMITS.bar ? "This template" : "This series"} needs at least ${min} rows.`,
    }
  }
  if (rows.length > max) {
    return { ok: true, rows: rows.slice(0, max) }
  }
  return { ok: true, rows }
}
