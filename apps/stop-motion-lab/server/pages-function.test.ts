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
})
