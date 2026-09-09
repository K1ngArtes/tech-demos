export type ApiMode = "openai" | "stub"

export type StatusResponse = {
  mode: ApiMode
  model: string
  sunburst: string
  note: string
}

export type ImageResponse = {
  b64: string
  stub: boolean
  model: string
}

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string }
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`)
  }
  return data
}

export function status(): Promise<StatusResponse> {
  return fetch("/api/status").then((response) => readJson<StatusResponse>(response))
}

export function generate(prompt: string, signal?: AbortSignal): Promise<ImageResponse> {
  return fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  }).then((response) => readJson<ImageResponse>(response))
}

export function edit(input: {
  imageB64: string
  motionPrompt: string
  frameIndex: number
  frameCount: number
  signal?: AbortSignal
}): Promise<ImageResponse> {
  return fetch("/api/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageB64: input.imageB64,
      motionPrompt: input.motionPrompt,
      frameIndex: input.frameIndex,
      frameCount: input.frameCount,
    }),
    signal: input.signal,
  }).then((response) => readJson<ImageResponse>(response))
}

export function dataUrl(b64: string) {
  return `data:image/png;base64,${b64}`
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read image"))
    reader.onload = () => {
      const result = String(reader.result ?? "")
      const comma = result.indexOf(",")
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.readAsDataURL(file)
  })
}
