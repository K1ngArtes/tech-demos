import { describe, expect, test } from "bun:test"

import { buildEditPrompt, buildGeneratePrompt } from "./prompts.ts"

describe("buildGeneratePrompt", () => {
  test("marks frame 1 and forbids text", () => {
    const prompt = buildGeneratePrompt("  a clay fox  ")
    expect(prompt.startsWith("a clay fox")).toBe(true)
    expect(prompt).toContain("frame 1")
    expect(prompt).toContain("No text")
  })
})

describe("buildEditPrompt", () => {
  test("locks identity and asks only for the next micro-motion", () => {
    const prompt = buildEditPrompt("turn the head right", 3, 8)
    expect(prompt).toContain("same character")
    expect(prompt).toContain("camera angle")
    expect(prompt).toContain("frame 3 of 8")
    expect(prompt).toContain("turn the head right")
    expect(prompt).toContain("Do not restyle")
  })
})
