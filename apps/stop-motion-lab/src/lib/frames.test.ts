import { describe, expect, test } from "bun:test"

import {
  clampFrameCount,
  FRAME_DEFAULT,
  FRAME_MAX,
  FRAME_MIN,
  MODEL_FLARE,
  MODEL_SUNBURST,
  parseFrameCount,
  parseFrameIndex,
  parseImageModel,
  parseImageQuality,
  QUALITY_DEFAULT,
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
} from "./frames.ts"

describe("clampFrameCount", () => {
  test("defaults non-finite values", () => {
    expect(clampFrameCount(Number.NaN)).toBe(FRAME_DEFAULT)
  })

  test("bounds to 4–16", () => {
    expect(clampFrameCount(1)).toBe(FRAME_MIN)
    expect(clampFrameCount(8)).toBe(8)
    expect(clampFrameCount(32)).toBe(FRAME_MAX)
  })
})

describe("parseFrameCount", () => {
  test("accepts the approved range", () => {
    expect(parseFrameCount(4)).toBe(4)
    expect(parseFrameCount(16)).toBe(16)
  })

  test("rejects spend-unbounded counts", () => {
    expect(() => parseFrameCount(17)).toThrow("4–16")
    expect(() => parseFrameCount(0)).toThrow("4–16")
  })
})

describe("parseFrameIndex", () => {
  test("must land inside the sequence", () => {
    expect(parseFrameIndex(2, 8)).toBe(2)
    expect(() => parseFrameIndex(9, 8)).toThrow("Invalid frame index")
  })
})

describe("parseImageModel", () => {
  test("defaults omitted values to Flare", () => {
    expect(parseImageModel(undefined)).toBe(MODEL_FLARE)
    expect(parseImageModel("")).toBe(MODEL_FLARE)
  })

  test("allowlists Flare and Sunburst only", () => {
    expect(parseImageModel(MODEL_FLARE)).toBe(MODEL_FLARE)
    expect(parseImageModel(MODEL_SUNBURST)).toBe(MODEL_SUNBURST)
    expect(() => parseImageModel("gpt-image-1")).toThrow("Invalid image model")
    expect(() => parseImageModel("dall-e-3")).toThrow("Invalid image model")
  })
})

describe("parseImageQuality", () => {
  test("defaults omitted values to low", () => {
    expect(parseImageQuality(undefined)).toBe(QUALITY_DEFAULT)
    expect(parseImageQuality(null)).toBe(QUALITY_LOW)
    expect(parseImageQuality("")).toBe(QUALITY_LOW)
  })

  test("allowlists low, medium, and high only", () => {
    expect(parseImageQuality(QUALITY_LOW)).toBe(QUALITY_LOW)
    expect(parseImageQuality(QUALITY_MEDIUM)).toBe(QUALITY_MEDIUM)
    expect(parseImageQuality(QUALITY_HIGH)).toBe(QUALITY_HIGH)
    expect(parseImageQuality("  high  ")).toBe(QUALITY_HIGH)
    expect(() => parseImageQuality("auto")).toThrow("Invalid image quality")
    expect(() => parseImageQuality("ultra")).toThrow("Invalid image quality")
    expect(() => parseImageQuality(2)).toThrow("Invalid image quality")
  })
})
