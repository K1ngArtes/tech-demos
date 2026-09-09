import { describe, expect, test } from "bun:test"

import {
  clampFrameCount,
  FRAME_DEFAULT,
  FRAME_MAX,
  FRAME_MIN,
  parseFrameCount,
  parseFrameIndex,
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
