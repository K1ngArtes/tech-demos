import { MODEL_FLARE, MODEL_SUNBURST } from "../src/lib/frames.ts"
import { apiMode, editFrame, generateFrame } from "./openai.ts"

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export async function handleApi(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname

  if (request.method === "GET" && (path === "/api/status" || path === "/api/health")) {
    const mode = apiMode()
    return json({
      mode,
      model: MODEL_FLARE,
      sunburst: MODEL_SUNBURST,
      note:
        mode === "stub"
          ? "UI-with-stub: OPENAI_API_KEY missing or STUB_OPENAI=1. Real generate/edit wiring is present."
          : "Live Flare generate/edit.",
    })
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  try {
    if (path === "/api/generate") {
      const body = (await request.json()) as { prompt?: string }
      const prompt = body.prompt?.trim()
      if (!prompt) return json({ error: "Subject prompt is required" }, 400)
      return json(await generateFrame(prompt))
    }

    if (path === "/api/edit") {
      const body = (await request.json()) as {
        imageB64?: string
        motionPrompt?: string
        frameIndex?: number
        frameCount?: number
      }
      const motionPrompt = body.motionPrompt?.trim()
      if (!motionPrompt) return json({ error: "Motion prompt is required" }, 400)
      return json(
        await editFrame({
          imageB64: body.imageB64 ?? "",
          motionPrompt,
          frameIndex: body.frameIndex,
          frameCount: body.frameCount,
        }),
      )
    }
  } catch (error) {
    const message = errorMessage(error)
    const status = message.includes("must be") || message.includes("Invalid") ? 400 : 502
    return json({ error: message }, status)
  }

  return json({ error: "Not found" }, 404)
}
