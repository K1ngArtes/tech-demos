import { useEffect, useMemo, useRef, useState } from "react"
import {
  Clapperboard,
  Download,
  ImagePlus,
  LoaderCircle,
  Pause,
  Play,
  Square,
  Trash2,
} from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { edit, fileToBase64, generate, status, dataUrl } from "@/lib/api"
import { downloadBlob, encodeGif, zipFrames } from "@/lib/export"
import {
  clampFps,
  clampFrameCount,
  FRAME_DEFAULT,
  FRAME_MAX,
  FRAME_MIN,
  FPS_DEFAULT,
  FPS_MAX,
  FPS_MIN,
} from "@/lib/frames"

const DEFAULT_SUBJECT =
  "A small red clay fox figurine on a worn wooden table, warm studio lighting, front three-quarter view, handmade stop-motion puppet"
const DEFAULT_MOTION =
  "The fox turns its head to the right, then takes one tiny step forward"

function errorMessage(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") return "Stopped."
  return error instanceof Error ? error.message : String(error)
}

export function Playground() {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [motion, setMotion] = useState(DEFAULT_MOTION)
  const [frameCount, setFrameCount] = useState(FRAME_DEFAULT)
  const [fps, setFps] = useState(FPS_DEFAULT)
  const [referenceB64, setReferenceB64] = useState<string | null>(null)
  const [frames, setFrames] = useState<string[]>([])
  const [playhead, setPlayhead] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [stub, setStub] = useState(false)
  const [modeNote, setModeNote] = useState("Checking API…")
  const abortRef = useRef<AbortController | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const current = frames[playhead]
  const currentSrc = current ? dataUrl(current) : referenceB64 ? dataUrl(referenceB64) : null

  useEffect(() => {
    let cancelled = false
    status()
      .then((info) => {
        if (cancelled) return
        setStub(info.mode === "stub")
        setModeNote(info.note)
      })
      .catch((caught: unknown) => {
        if (cancelled) return
        setModeNote(errorMessage(caught))
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const item = [...(event.clipboardData?.items ?? [])].find((entry) =>
        entry.type.startsWith("image/"),
      )
      const file = item?.getAsFile()
      if (!file) return
      event.preventDefault()
      void fileToBase64(file).then(setReferenceB64)
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [])

  useEffect(() => {
    if (!playing || frames.length === 0) return
    const id = window.setInterval(() => {
      setPlayhead((index) => (index + 1) % frames.length)
    }, 1000 / fps)
    return () => window.clearInterval(id)
  }, [playing, fps, frames.length])

  const frameLabel = useMemo(() => {
    if (frames.length === 0) return "No frames yet"
    return `Frame ${playhead + 1} / ${frames.length}`
  }, [frames.length, playhead])

  async function onPickReference(file: File | undefined) {
    if (!file) return
    setReferenceB64(await fileToBase64(file))
  }

  async function onGenerate() {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const count = clampFrameCount(frameCount)
    setFrameCount(count)
    setBusy(true)
    setPlaying(false)
    setError(null)
    setFrames([])
    setPlayhead(0)
    setProgress(referenceB64 ? "Using reference as frame 1…" : "Generating frame 1…")

    try {
      const collected: string[] = []
      let usedStub = false

      if (referenceB64) {
        collected.push(referenceB64)
      } else {
        const first = await generate(subject, controller.signal)
        collected.push(first.b64)
        usedStub = first.stub
      }
      setFrames([...collected])
      setPlayhead(0)

      for (let index = 2; index <= count; index++) {
        setProgress(`Editing frame ${index} of ${count}…`)
        const next = await edit({
          imageB64: collected[collected.length - 1] ?? "",
          motionPrompt: motion,
          frameIndex: index,
          frameCount: count,
          signal: controller.signal,
        })
        collected.push(next.b64)
        usedStub = usedStub || next.stub
        setFrames([...collected])
        setPlayhead(collected.length - 1)
      }

      setStub(usedStub)
      setProgress("")
      setPlaying(true)
    } catch (caught) {
      if (controller.signal.aborted) {
        setError("Stopped.")
      } else {
        setError(errorMessage(caught))
      }
      setProgress("")
    } finally {
      setBusy(false)
    }
  }

  function onStop() {
    abortRef.current?.abort()
    setBusy(false)
    setPlaying(false)
    setProgress("")
  }

  async function onGif() {
    if (frames.length === 0) return
    const blob = await encodeGif(frames.map(dataUrl), fps)
    downloadBlob(blob, "stop-motion.gif")
  }

  async function onZip() {
    if (frames.length === 0) return
    const blob = await zipFrames(frames)
    downloadBlob(blob, "stop-motion-frames.zip")
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Stop-Motion Lab · GPT-Image 2.5
            </p>
            <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Chain edits. Keep the puppet.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Frame 1 is a Flare generate (or your still). Each hop edits the
              previous PNG so only the next micro-motion lands. Hard cap{" "}
              {FRAME_MIN}–{FRAME_MAX} frames.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">gpt-image-2.5-flare</Badge>
            <Badge variant={stub ? "outline" : "default"}>
              {stub ? "UI-with-stub" : "Live Flare"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Shot</CardTitle>
            <CardDescription>
              Subject locks identity. Motion is the whole action, sliced into
              tiny hops.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Textarea
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                rows={4}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motion">Motion</Label>
              <Textarea
                id="motion"
                value={motion}
                onChange={(event) => setMotion(event.target.value)}
                rows={3}
                disabled={busy}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="frames">Frames</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {frameCount}
                </span>
              </div>
              <Slider
                id="frames"
                min={FRAME_MIN}
                max={FRAME_MAX}
                step={1}
                value={[frameCount]}
                disabled={busy}
                onValueChange={(value) =>
                  setFrameCount(clampFrameCount(value[0] ?? FRAME_DEFAULT))
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="fps">FPS</Label>
                <span className="font-mono text-xs text-muted-foreground">{fps}</span>
              </div>
              <Slider
                id="fps"
                min={FPS_MIN}
                max={FPS_MAX}
                step={1}
                value={[fps]}
                onValueChange={(value) => setFps(clampFps(value[0] ?? FPS_DEFAULT))}
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Reference still (optional frame 1)</Label>
              <p className="text-xs text-muted-foreground">
                Upload or paste an image to skip generate.
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    void onPickReference(event.target.files?.[0])
                    event.target.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                >
                  <ImagePlus />
                  Upload
                </Button>
                {referenceB64 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => setReferenceB64(null)}
                  >
                    <Trash2 />
                    Clear still
                  </Button>
                ) : null}
              </div>
              {referenceB64 ? (
                <img
                  src={dataUrl(referenceB64)}
                  alt="Reference still"
                  className="h-20 w-20 rounded-md object-cover ring-1 ring-foreground/10"
                />
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy || (!subject.trim() && !referenceB64)}
                onClick={() => void onGenerate()}
              >
                {busy ? <LoaderCircle className="animate-spin" /> : <Clapperboard />}
                Generate
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!busy}
                onClick={onStop}
              >
                <Square />
                Stop
              </Button>
            </div>
            {progress ? (
              <p className="text-xs text-muted-foreground">{progress}</p>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stage</CardTitle>
              <CardDescription>{frameLabel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-black/40 ring-1 ring-foreground/10">
                {currentSrc ? (
                  <img
                    src={currentSrc}
                    alt={frameLabel}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <p className="max-w-xs px-6 text-center text-sm text-muted-foreground">
                    Generate a sequence or drop a still on frame 1.
                  </p>
                )}
              </div>
              {frames.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {frames.map((frame, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setPlaying(false)
                          setPlayhead(index)
                        }}
                        className={`relative shrink-0 overflow-hidden rounded-md ring-2 ${
                          index === playhead
                            ? "ring-primary"
                            : "ring-transparent hover:ring-foreground/20"
                        }`}
                      >
                        <img
                          src={dataUrl(frame)}
                          alt={`Frame ${index + 1}`}
                          className="h-16 w-16 object-cover"
                        />
                        <span className="absolute right-1 bottom-1 rounded bg-black/60 px-1 font-mono text-[10px] text-white">
                          {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                  <Slider
                    min={0}
                    max={Math.max(0, frames.length - 1)}
                    step={1}
                    value={[playhead]}
                    onValueChange={(value) => {
                      setPlaying(false)
                      setPlayhead(value[0] ?? 0)
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPlaying((value) => !value)}
                    >
                      {playing ? <Pause /> : <Play />}
                      {playing ? "Pause" : "Play loop"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void onGif()}
                    >
                      <Download />
                      GIF
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void onZip()}
                    >
                      <Download />
                      ZIP frames
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Could not finish the sequence</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>
                {stub ? "Validation is UI-with-stub" : "Key stays on the server"}
              </AlertTitle>
              <AlertDescription>{modeNote}</AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  )
}
