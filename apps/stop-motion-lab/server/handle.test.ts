import { describe, expect, test } from "bun:test"

import { handleApi } from "./handle.ts"
import { stubFramePng } from "./png.ts"

const stubEnv = { STUB_OPENAI: "1", OPENAI_API_KEY: "" } as const

async function jsonOf(response: Response) {
  return (await response.json()) as Record<string, unknown>
}

describe("handleApi", () => {
  test("GET /api/status is stub without a key", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/status"),
      stubEnv,
    )
    expect(response.status).toBe(200)
    const body = await jsonOf(response)
    expect(body.mode).toBe("stub")
    expect(body.model).toBe("gpt-image-2.5-flare")
  })

  test("GET /api/status is openai when a Pages secret is bound", async () => {
    const response = await handleApi(new Request("http://localhost/api/status"), {
      OPENAI_API_KEY: "sk-test",
    })
    expect(response.status).toBe(200)
    expect((await jsonOf(response)).mode).toBe("openai")
  })

  test("GET /api/health matches status", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/health"),
      stubEnv,
    )
    expect(response.status).toBe(200)
    expect((await jsonOf(response)).mode).toBe("stub")
  })

  test("POST /api/generate requires a subject prompt", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "  " }),
      }),
      stubEnv,
    )
    expect(response.status).toBe(400)
    expect((await jsonOf(response)).error).toBe("Subject prompt is required")
  })

  test("POST /api/generate returns a stub PNG", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "a clay fox" }),
      }),
      stubEnv,
    )
    expect(response.status).toBe(200)
    const body = await jsonOf(response)
    expect(body.stub).toBe(true)
    expect(typeof body.b64).toBe("string")
    expect(String(body.b64).length).toBeGreaterThan(32)
  })

  test("POST /api/edit rejects a spend-unbounded frame count", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motionPrompt: "turn the head",
          frameIndex: 2,
          frameCount: 32,
        }),
      }),
      stubEnv,
    )
    expect(response.status).toBe(400)
    expect(String((await jsonOf(response)).error)).toContain("4–16")
  })

  test("POST /api/edit clamps only via parse (4–16 accepted)", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motionPrompt: "turn the head",
          frameIndex: 2,
          frameCount: 8,
        }),
      }),
      stubEnv,
    )
    expect(response.status).toBe(200)
    const body = await jsonOf(response)
    expect(body.stub).toBe(true)
    expect(body.model).toBe("gpt-image-2.5-flare")
  })

  test("unknown routes 404", async () => {
    const response = await handleApi(
      new Request("http://localhost/api/nope", { method: "POST" }),
      stubEnv,
    )
    expect(response.status).toBe(404)
  })
})

describe("stubFramePng", () => {
  test("writes a PNG signature", () => {
    const png = stubFramePng(1, 8)
    expect([...png.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10])
  })
})
