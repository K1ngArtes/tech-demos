export type RuntimeEnv = {
  OPENAI_API_KEY?: string
  STUB_OPENAI?: string
}

function processEnv(name: keyof RuntimeEnv): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process
  return proc?.env?.[name]
}

/** Pages Functions pass `context.env`; Vite/Bun omit it and read `process.env`. */
export function resolveEnv(env?: RuntimeEnv): RuntimeEnv {
  return {
    OPENAI_API_KEY: env?.OPENAI_API_KEY ?? processEnv("OPENAI_API_KEY"),
    STUB_OPENAI: env?.STUB_OPENAI ?? processEnv("STUB_OPENAI"),
  }
}

export function apiMode(env: RuntimeEnv = resolveEnv()): "openai" | "stub" {
  if (env.STUB_OPENAI === "1") return "stub"
  if (!env.OPENAI_API_KEY?.trim()) return "stub"
  return "openai"
}
