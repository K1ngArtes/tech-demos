export const FRAME_MIN = 4
export const FRAME_MAX = 16
export const FRAME_DEFAULT = 8

export const FPS_MIN = 2
export const FPS_MAX = 16
export const FPS_DEFAULT = 8

export const MODEL_FLARE = "gpt-image-2.5-flare"
export const MODEL_SUNBURST = "gpt-image-2.5-sunburst"
export const IMAGE_MODELS = [MODEL_FLARE, MODEL_SUNBURST] as const
export type ImageModel = (typeof IMAGE_MODELS)[number]
export const MODEL_DEFAULT = MODEL_FLARE

export function imageModelLabel(model: ImageModel): "Flare" | "Sunburst" {
  return model === MODEL_SUNBURST ? "Sunburst" : "Flare"
}

/** Allowlist only Flare and Sunburst. Omitted / empty defaults to Flare. */
export function parseImageModel(value: unknown): ImageModel {
  if (value === undefined || value === null || value === "") return MODEL_DEFAULT
  if (typeof value !== "string") {
    throw new Error("Invalid image model")
  }
  const model = value.trim()
  if (model === MODEL_FLARE || model === MODEL_SUNBURST) return model
  throw new Error("Invalid image model")
}

export function clampFrameCount(value: number): number {
  if (!Number.isFinite(value)) return FRAME_DEFAULT
  return Math.min(FRAME_MAX, Math.max(FRAME_MIN, Math.round(value)))
}

export function clampFps(value: number): number {
  if (!Number.isFinite(value)) return FPS_DEFAULT
  return Math.min(FPS_MAX, Math.max(FPS_MIN, Math.round(value)))
}

export function parseFrameCount(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n)) {
    throw new Error(`Frame count must be ${FRAME_MIN}–${FRAME_MAX}`)
  }
  const rounded = Math.round(n)
  if (rounded < FRAME_MIN || rounded > FRAME_MAX) {
    throw new Error(`Frame count must be ${FRAME_MIN}–${FRAME_MAX}`)
  }
  return rounded
}

export function parseFrameIndex(value: unknown, frameCount: number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) {
    throw new Error("Invalid frame index")
  }
  const rounded = Math.round(n)
  if (rounded < 1 || rounded > frameCount) {
    throw new Error("Invalid frame index")
  }
  return rounded
}
