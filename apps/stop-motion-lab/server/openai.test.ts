import { afterEach, describe, expect, mock, test } from "bun:test"

import { bytesToBase64 } from "./bytes.ts"
import { generateFrame, editFrame } from "./openai.ts"
import { stubFramePng } from "./png.ts"

const liveEnv = { OPENAI_API_KEY: "sk-test" } as const

afterEach(() => {
  mock.restore()
})

function mockOpenAIOk() {
  const calls: { url: string; init: RequestInit }[] = []
  const fetchMock = mock(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url
    calls.push({ url, init: init ?? {} })
    return new Response(JSON.stringify({ data: [{ b64_json: "ZmFrZQ==" }] }), {
      status: 200,
    })
  })
  globalThis.fetch = fetchMock as typeof fetch
  return calls
}

describe("live OpenAI quality passthrough", () => {
  test("generate sends the chosen quality on /v1/images/generations", async () => {
    const calls = mockOpenAIOk()
    const result = await generateFrame(
      "a clay fox",
      liveEnv,
      "gpt-image-2.5-flare",
      "high",
    )
    expect(result.quality).toBe("high")
    expect(result.stub).toBe(false)
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toContain("/v1/images/generations")
    const body = JSON.parse(String(calls[0]?.init.body)) as { quality?: string }
    expect(body.quality).toBe("high")
  })

  test("edit sends the chosen quality on /v1/images/edits", async () => {
    const calls = mockOpenAIOk()
    const result = await editFrame(
      {
        imageB64: bytesToBase64(stubFramePng(1, 8)),
        motionPrompt: "turn the head",
        frameIndex: 2,
        frameCount: 8,
        quality: "medium",
      },
      liveEnv,
    )
    expect(result.quality).toBe("medium")
    expect(result.stub).toBe(false)
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toContain("/v1/images/edits")
    const form = calls[0]?.init.body as FormData
    expect(form.get("quality")).toBe("medium")
  })
})
