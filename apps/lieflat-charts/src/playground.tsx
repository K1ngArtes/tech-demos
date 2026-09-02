import { useMemo, useState } from "react"
import { Download, RotateCcw } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { generateChartHtml } from "@/lib/generate"
import { slugify } from "@/lib/html"
import { parseTable, validateRows } from "@/lib/parse"
import { SAMPLES } from "@/lib/sample"
import {
  CHART_TEMPLATES,
  TEMPLATE_META,
  type ChartTemplate,
} from "@/lib/types"

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function Playground() {
  const [template, setTemplate] = useState<ChartTemplate>("bar")
  const [raw, setRaw] = useState(SAMPLES.bar.csv)
  const [title, setTitle] = useState(SAMPLES.bar.copy.title)
  const [subtitle, setSubtitle] = useState(SAMPLES.bar.copy.subtitle)
  const [source, setSource] = useState(SAMPLES.bar.copy.source)
  const [usingSample, setUsingSample] = useState(true)

  const parsed = useMemo(() => parseTable(raw), [raw])
  const checked = useMemo(() => {
    if (!parsed.ok) return parsed
    return validateRows(parsed.rows, template)
  }, [parsed, template])

  const html = useMemo(() => {
    if (!checked.ok) return null
    return generateChartHtml({
      template,
      title,
      subtitle,
      source,
      rows: checked.rows,
    })
  }, [checked, template, title, subtitle, source])

  const truncated =
    parsed.ok && checked.ok && parsed.rows.length > checked.rows.length

  function applyTemplate(next: ChartTemplate) {
    setTemplate(next)
    if (!usingSample) return
    const sample = SAMPLES[next]
    setRaw(sample.csv)
    setTitle(sample.copy.title)
    setSubtitle(sample.copy.subtitle)
    setSource(sample.copy.source)
  }

  function loadSample() {
    const sample = SAMPLES[template]
    setRaw(sample.csv)
    setTitle(sample.copy.title)
    setSubtitle(sample.copy.subtitle)
    setSource(sample.copy.source)
    setUsingSample(true)
  }

  const meta = TEMPLATE_META[template]

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Lieflat Charts · playground
            </p>
            <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Data in. One editorial HTML file out.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Paste CSV or JSON, pick a Lupi Basics silhouette, download a
              single-file Mono chart. Noncommercial demo — no agent runtime.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{meta.id}</Badge>
            <Badge variant="secondary">{meta.name}</Badge>
            <Button
              onClick={() => {
                if (!html) return
                downloadHtml(`${slugify(title)}.html`, html)
              }}
              disabled={!html}
            >
              <Download data-icon="inline-start" />
              Download HTML
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
              <CardDescription>{meta.hint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs
                value={template}
                onValueChange={(value) => applyTemplate(value as ChartTemplate)}
              >
                <TabsList className="w-full">
                  {CHART_TEMPLATES.map((key) => (
                    <TabsTrigger key={key} value={key} className="flex-1">
                      {TEMPLATE_META[key].name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Data</CardTitle>
                <CardDescription>
                  CSV or JSON. First text column is the label; first number is
                  the value.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadSample}
                type="button"
              >
                <RotateCcw data-icon="inline-start" />
                Sample
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                aria-label="Chart data"
                value={raw}
                onChange={(event) => {
                  setRaw(event.target.value)
                  setUsingSample(false)
                }}
                className="min-h-48 font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
              {checked.ok ? (
                <p className="text-xs text-muted-foreground">
                  {checked.rows.length} rows
                  {parsed.ok ? ` · ${parsed.format.toUpperCase()}` : ""}
                  {truncated
                    ? ` · using the first ${checked.rows.length}`
                    : ""}
                </p>
              ) : (
                <Alert>
                  <AlertTitle>Can&apos;t draw yet</AlertTitle>
                  <AlertDescription>{checked.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Copy</CardTitle>
              <CardDescription>
                Titles state a conclusion. The source line is set in small caps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    setUsingSample(false)
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(event) => {
                    setSubtitle(event.target.value)
                    setUsingSample(false)
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(event) => {
                    setSource(event.target.value)
                    setUsingSample(false)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is the file you download. Click the chart to replay the
              entrance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {html ? (
              <iframe
                title="Generated chart"
                srcDoc={html}
                className="h-[720px] w-full bg-[#F0EFEB]"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center px-8 text-center text-sm text-muted-foreground">
                Load a sample or paste a table to see the chart.
              </div>
            )}
            <Separator />
            <p className="px-5 py-3 text-[11px] leading-relaxed text-muted-foreground">
              Visual language from{" "}
              <a
                className="underline underline-offset-3"
                href="https://github.com/larashero3-dotcom/lieflat-charts"
                target="_blank"
                rel="noreferrer"
              >
                lieflat-charts
              </a>{" "}
              under PolyForm Noncommercial 1.0.0. This playground does not
              vendor the upstream repo.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
