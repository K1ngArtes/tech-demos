import { join } from "node:path"

import { handleApi } from "./handle.ts"

const port = Number(process.env.PORT) || 5173
const dist = join(import.meta.dir, "..", "dist")

function notApi(pathname: string) {
  return !pathname.startsWith("/api")
}

async function staticFile(pathname: string) {
  let path = pathname
  if (path === "/" || path === "/stop-motion-lab") {
    return Response.redirect(`http://127.0.0.1:${port}/stop-motion-lab/`, 302)
  }
  if (path.startsWith("/stop-motion-lab")) {
    path = path.slice("/stop-motion-lab".length) || "/"
  }
  if (path === "/") path = "/index.html"
  const file = Bun.file(join(dist, path))
  if (await file.exists()) return new Response(file)
  return new Response(Bun.file(join(dist, "index.html")))
}

Bun.serve({
  port,
  async fetch(request) {
    const { pathname } = new URL(request.url)
    if (pathname.startsWith("/api")) return handleApi(request)
    if (notApi(pathname)) return staticFile(pathname)
    return new Response("Not found", { status: 404 })
  },
})

console.log(`Stop-Motion Lab  http://127.0.0.1:${port}/stop-motion-lab/`)
