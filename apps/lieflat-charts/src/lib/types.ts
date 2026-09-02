export const CHART_TEMPLATES = ["bar", "line", "area"] as const

export type ChartTemplate = (typeof CHART_TEMPLATES)[number]

export type DataRow = {
  label: string
  value: number
}

export type ParseOk = {
  ok: true
  rows: DataRow[]
  format: "csv" | "json"
}

export type ParseErr = {
  ok: false
  error: string
}

export type ParseResult = ParseOk | ParseErr

export type ChartCopy = {
  title: string
  subtitle: string
  source: string
}

export type ChartSpec = ChartCopy & {
  template: ChartTemplate
  rows: DataRow[]
}

export const TEMPLATE_META: Record<
  ChartTemplate,
  { id: string; name: string; badge: string; hint: string }
> = {
  bar: {
    id: "F1",
    name: "Rung Bars",
    badge: "LUPI BASICS · F1 RUNG BARS · MONO",
    hint: "Few categories. Each rung is one honest unit.",
  },
  line: {
    id: "F2",
    name: "Hairline Line",
    badge: "LUPI BASICS · F2 HAIRLINE LINE · MONO",
    hint: "A short series. One dot is one day.",
  },
  area: {
    id: "F3",
    name: "Hairline Area",
    badge: "LUPI BASICS · F3 HAIRLINE AREA · MONO",
    hint: "A series read as shape. The fill is days, not paint.",
  },
}

export const LIMITS = {
  bar: { min: 2, max: 12 },
  line: { min: 2, max: 60 },
  area: { min: 2, max: 60 },
} as const
