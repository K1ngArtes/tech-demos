import { useEffect, useRef, useState } from "react"
import { Download, Play, RotateCcw } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  SAMPLE_ORDER,
  SAMPLES,
  type SampleId,
} from "@/lib/samples"
import {
  CANVAS_SIZE,
  downloadPng,
  mountCanvas,
  runSketch,
} from "@/lib/run-sketch"

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function Playground() {
  const [sampleId, setSampleId] = useState<SampleId>("hibiscus")
  const [code, setCode] = useState(SAMPLES.hibiscus.code)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [painted, setPainted] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  function paint(source: string) {
    setBusy(true)
    setError(null)
    window.setTimeout(() => {
      try {
        runSketch(source)
        setPainted(true)
      } catch (caught) {
        setError(errorMessage(caught))
      } finally {
        setBusy(false)
      }
    }, 20)
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    try {
      canvasRef.current = mountCanvas(host)
    } catch (caught) {
      setError(errorMessage(caught))
      return
    }
    paint(SAMPLES.hibiscus.code)
    return () => {
      canvasRef.current?.remove()
      canvasRef.current = null
    }
  }, [])

  function applySample(id: SampleId) {
    setSampleId(id)
    setCode(SAMPLES[id].code)
    paint(SAMPLES[id].code)
  }

  const sample = SAMPLES[sampleId]

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Paint with Code · playground
            </p>
            <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              The code is the artefact.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Edit p5.brush JavaScript and re-render. Strokes stay editable —
              you are not stuck prompting an image. Inspired by training models
              to paint with watercolor code; this screen is the playground, not
              the trainer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">p5.brush</Badge>
            <Badge variant="secondary">{sample.name}</Badge>
            <Button
              type="button"
              onClick={() => {
                const canvas = canvasRef.current
                if (!canvas || !painted) return
                downloadPng(canvas, `${sampleId}.png`)
              }}
              disabled={!painted || busy}
            >
              <Download data-icon="inline-start" />
              Download PNG
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]">
        <Card>
          <CardHeader>
            <CardTitle>Sketch</CardTitle>
            <CardDescription>
              Origin is the canvas center.{" "}
              <code className="font-mono text-xs">width</code> /{" "}
              <code className="font-mono text-xs">height</code> are{" "}
              {CANVAS_SIZE}. Use{" "}
              <code className="font-mono text-xs">brush.fill</code> for
              watercolor bleed — not native canvas fills.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs
              value={sampleId}
              onValueChange={(value) => applySample(value as SampleId)}
            >
              <TabsList className="w-full">
                {SAMPLE_ORDER.map((id) => (
                  <TabsTrigger key={id} value={id} className="flex-1">
                    {SAMPLES[id].name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground">{sample.blurb}</p>
            <Textarea
              aria-label="p5.brush sketch"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              className="min-h-80 font-mono text-xs leading-relaxed md:min-h-[28rem]"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => paint(code)} disabled={busy}>
                <Play data-icon="inline-start" />
                {busy ? "Painting…" : "Run"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setCode(sample.code)
                  paint(sample.code)
                }}
              >
                <RotateCcw data-icon="inline-start" />
                Reset
              </Button>
            </div>
            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Sketch failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Canvas</CardTitle>
            <CardDescription>
              Watercolor bleed from p5.brush. Change a stroke in the editor and
              Run again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div
              ref={hostRef}
              className="flex min-h-[560px] items-center justify-center overflow-hidden rounded-lg bg-[#f4efe6] ring-1 ring-foreground/10"
            />
            <Separator />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              One user, no auth, no model calls. Source idea:{" "}
              <a
                className="underline underline-offset-3"
                href="https://surya.website/rling-qwen-to-paint-with-code"
                target="_blank"
                rel="noreferrer"
              >
                Training AI to Paint with Code
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
