import type { IncomingMessage, ServerResponse } from "node:http"

import { handleApi } from "./handle.ts"

async function toRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? "127.0.0.1"
  const url = `http://${host}${req.url ?? "/"}`
  const method = req.method ?? "GET"
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    headers.set(key, Array.isArray(value) ? value.join(", ") : value)
  }

  if (method === "GET" || method === "HEAD") {
    return new Request(url, { method, headers })
  }

  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }
  return new Request(url, {
    method,
    headers,
    body: Buffer.concat(chunks),
  })
}

export async function viteApiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const path = (req.url ?? "").split("?")[0] ?? ""
  if (!path.startsWith("/api")) {
    next()
    return
  }

  try {
    const response = await handleApi(await toRequest(req))
    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    res.end(Buffer.from(await response.arrayBuffer()))
  } catch (error) {
    res.statusCode = 500
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
    )
  }
}
