import { deflateSync } from "node:zlib"

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let i = 0; i < 8; i++) {
      const mask = -(crc & 1)
      crc = (crc >>> 1) ^ (0xedb88320 & mask)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function u32(value: number): Uint8Array {
  return new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ])
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type)
  const payload = new Uint8Array(typeBytes.length + data.length)
  payload.set(typeBytes, 0)
  payload.set(data, typeBytes.length)
  const out = new Uint8Array(12 + data.length)
  out.set(u32(data.length), 0)
  out.set(payload, 4)
  out.set(u32(crc32(payload)), 8 + data.length)
  return out
}

export function encodeRgbPng(
  width: number,
  height: number,
  rgb: Uint8Array,
): Uint8Array {
  const raw = new Uint8Array(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const row = y * (1 + width * 3)
    raw[row] = 0
    raw.set(rgb.subarray(y * width * 3, (y + 1) * width * 3), row + 1)
  }

  const ihdr = new Uint8Array(13)
  ihdr.set(u32(width), 0)
  ihdr.set(u32(height), 4)
  ihdr[8] = 8
  ihdr[9] = 2

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
  const parts = [
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", new Uint8Array()),
  ]
  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const png = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    png.set(part, offset)
    offset += part.length
  }
  return png
}

function setPixel(
  rgb: Uint8Array,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
) {
  if (x < 0 || y < 0 || x >= width) return
  const i = (y * width + x) * 3
  rgb[i] = r
  rgb[i + 1] = g
  rgb[i + 2] = b
}

function fillRect(
  rgb: Uint8Array,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: number,
  g: number,
  b: number,
) {
  const left = Math.max(0, Math.floor(x0))
  const top = Math.max(0, Math.floor(y0))
  const right = Math.min(width, Math.ceil(x1))
  const bottom = Math.min(height, Math.ceil(y1))
  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      setPixel(rgb, width, x, y, r, g, b)
    }
  }
}

function fillCircle(
  rgb: Uint8Array,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  r: number,
  g: number,
  b: number,
) {
  const r2 = radius * radius
  const x0 = Math.max(0, Math.floor(cx - radius))
  const y0 = Math.max(0, Math.floor(cy - radius))
  const x1 = Math.min(width, Math.ceil(cx + radius))
  const y1 = Math.min(height, Math.ceil(cy + radius))
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const dx = x + 0.5 - cx
      const dy = y + 0.5 - cy
      if (dx * dx + dy * dy <= r2) {
        setPixel(rgb, width, x, y, r, g, b)
      }
    }
  }
}

/** Canned bouncing-clay-ball frames so the UI can be recorded without image credits. */
export function stubFramePng(frameIndex: number, frameCount: number): Uint8Array {
  const size = 256
  const rgb = new Uint8Array(size * size * 3)
  fillRect(rgb, size, size, 0, 0, size, size, 28, 22, 18)
  fillRect(rgb, size, size, 0, 176, size, size, 46, 36, 28)

  for (let y = 0; y < size; y += 18) {
    fillRect(rgb, size, size, 0, y + 4, 10, y + 14, 18, 14, 12)
    fillRect(rgb, size, size, size - 10, y + 4, size, y + 14, 18, 14, 12)
  }

  const t = (frameIndex - 1) / Math.max(1, frameCount - 1)
  const x = 48 + t * 160
  const y = 168 - Math.sin(t * Math.PI) * 78
  fillCircle(rgb, size, size, x + 3, 176, 18, 22, 16, 12)
  fillCircle(rgb, size, size, x, y, 28, 196, 72, 42)
  fillCircle(rgb, size, size, x - 8, y - 8, 8, 232, 140, 96)

  return encodeRgbPng(size, size, rgb)
}

export function pngToBase64(png: Uint8Array): string {
  return Buffer.from(png).toString("base64")
}
