import {
  MODEL_FLARE,
  parseFrameCount,
  parseFrameIndex,
} from "../src/lib/frames.ts"
import { buildEditPrompt, buildGeneratePrompt } from "../src/lib/prompts.ts"
import { pngToBase64, stubFramePng } from "./png.ts"

const OPENAI_GENERATIONS = "https://api.openai.com/v1/images/generations"
const OPENAI_EDITS = "https://api.openai.com/v1/images/edits"
const FRAME_STUB_HINT = 8

export type ImageResult = {
  b64: string
  stub: boolean
  model: string
}

export function apiMode(): "openai" | "stub" {
  if (process.env.STUB_OPENAI === "1") return "stub"
  if (!process.env.OPENAI_API_KEY?.trim()) return "stub"
  return "openai"
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function openaiError(response: Response): Promise<string> {
  const text = await response.text()
  try {
    const json = JSON.parse(text) as { error?: { message?: string } }
    if (json.error?.message) return json.error.message
  } catch {
    /* use raw text */
  }
  return text.slice(0, 400) || `OpenAI HTTP ${response.status}`
}

async function generateLive(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY is missing")

  const response = await fetch(OPENAI_GENERATIONS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL_FLARE,
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "low",
      output_format: "png",
    }),
  })
  if (!response.ok) throw new Error(await openaiError(response))
  const json = (await response.json()) as { data?: { b64_json?: string }[] }
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error("OpenAI generate returned no image")
  return b64
}

async function editLive(imageB64: string, prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY is missing")

  const bytes = Buffer.from(imageB64, "base64")
  const form = new FormData()
  form.set("model", MODEL_FLARE)
  form.set("prompt", prompt)
  form.set("n", "1")
  form.set("size", "1024x1024")
  form.set("quality", "low")
  form.set("output_format", "png")
  form.set(
    "image",
    new File([bytes], "frame.png", { type: "image/png" }),
  )

  const response = await fetch(OPENAI_EDITS, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  })
  if (!response.ok) throw new Error(await openaiError(response))
  const json = (await response.json()) as { data?: { b64_json?: string }[] }
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error("OpenAI edit returned no image")
  return b64
}

export async function generateFrame(subjectPrompt: string): Promise<ImageResult> {
  const prompt = buildGeneratePrompt(subjectPrompt)
  if (apiMode() === "stub") {
    await sleep(90)
    return {
      b64: pngToBase64(stubFramePng(1, FRAME_STUB_HINT)),
      stub: true,
      model: MODEL_FLARE,
    }
  }
  return { b64: await generateLive(prompt), stub: false, model: MODEL_FLARE }
}

export async function editFrame(input: {
  imageB64: string
  motionPrompt: string
  frameIndex: unknown
  frameCount: unknown
}): Promise<ImageResult> {
  const frameCount = parseFrameCount(input.frameCount)
  const frameIndex = parseFrameIndex(input.frameIndex, frameCount)
  const prompt = buildEditPrompt(input.motionPrompt, frameIndex, frameCount)

  if (apiMode() === "stub") {
    await sleep(70)
    return {
      b64: pngToBase64(stubFramePng(frameIndex, frameCount)),
      stub: true,
      model: MODEL_FLARE,
    }
  }

  if (!input.imageB64?.trim()) {
    throw new Error("Previous frame image is required")
  }
  return {
    b64: await editLive(input.imageB64, prompt),
    stub: false,
    model: MODEL_FLARE,
  }
}
