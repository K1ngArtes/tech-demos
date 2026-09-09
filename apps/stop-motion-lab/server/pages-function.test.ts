import { describe, expect, test } from "bun:test"

import { onRequest } from "../../../functions/api/_shared.ts"

describe("Pages Function wrapper", () => {
  test("GET /api/status uses the shared handleApi contract", async () => {
    const response = await onRequest({
      request: new Request("https://tech-demos-6tg.pages.dev/api/status"),
      env: { STUB_OPENAI: "1" },
    })
    expect(response.status).toBe(200)
    const body = (await response.json()) as { mode?: string }
    expect(body.mode).toBe("stub")
  })

  test("POST /api/generate allowlists quality through the shared handler", async () => {
    const ok = await onRequest({
      request: new Request("https://tech-demos-6tg.pages.dev/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "a clay fox", quality: "medium" }),
      }),
      env: { STUB_OPENAI: "1" },
    })
    expect(ok.status).toBe(200)
    expect(((await ok.json()) as { quality?: string }).quality).toBe("medium")

    const bad = await onRequest({
      request: new Request("https://tech-demos-6tg.pages.dev/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "a clay fox", quality: "ultra" }),
      }),
      env: { STUB_OPENAI: "1" },
    })
    expect(bad.status).toBe(400)
    expect(((await bad.json()) as { error?: string }).error).toBe(
      "Invalid image quality",
    )
  })
})
