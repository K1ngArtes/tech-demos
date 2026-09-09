import { handleApi } from "../../apps/stop-motion-lab/server/handle.ts"
import type { RuntimeEnv } from "../../apps/stop-motion-lab/server/env.ts"

type PagesContext = {
  request: Request
  env: RuntimeEnv
}

/** Same JSON contract as Vite middleware / `bun run start`. */
export function onRequest(context: PagesContext): Promise<Response> {
  return handleApi(context.request, context.env)
}
