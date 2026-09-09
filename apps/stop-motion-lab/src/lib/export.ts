import { GIFEncoder, applyPalette, quantize } from "gifenc"
import JSZip from "jszip"

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.src = src
  await image.decode()
  return image
}

async function toImageData(src: string, maxSize: number): Promise<ImageData> {
  const image = await loadImage(src)
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is unavailable")
  ctx.drawImage(image, 0, 0, width, height)
  return ctx.getImageData(0, 0, width, height)
}

export async function encodeGif(dataUrls: string[], fps: number): Promise<Blob> {
  const delay = Math.round(1000 / Math.max(1, fps))
  const gif = GIFEncoder()
  for (const src of dataUrls) {
    const { data, width, height } = await toImageData(src, 512)
    const palette = quantize(data, 256)
    const index = applyPalette(data, palette)
    gif.writeFrame(index, width, height, { palette, delay })
  }
  gif.finish()
  return new Blob([gif.bytes() as BlobPart], { type: "image/gif" })
}

export async function zipFrames(framesB64: string[]): Promise<Blob> {
  const zip = new JSZip()
  framesB64.forEach((b64, index) => {
    const name = `frame-${String(index + 1).padStart(2, "0")}.png`
    zip.file(name, b64, { base64: true })
  })
  return zip.generateAsync({ type: "blob" })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
