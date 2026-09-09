type NodeBuffer = {
  from(data: string, enc: "base64"): Uint8Array
  from(data: Uint8Array): { toString(enc: "base64"): string }
}

function nodeBuffer(): NodeBuffer | undefined {
  const ctor = (globalThis as { Buffer?: NodeBuffer }).Buffer
  return ctor
}

export function bytesToBase64(bytes: Uint8Array): string {
  const BufferCtor = nodeBuffer()
  if (BufferCtor) return BufferCtor.from(bytes).toString("base64")

  const chunk = 0x8000
  let binary = ""
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function base64ToBytes(b64: string): Uint8Array {
  const BufferCtor = nodeBuffer()
  if (BufferCtor) return new Uint8Array(BufferCtor.from(b64, "base64"))

  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}
