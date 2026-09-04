import * as brush from "p5.brush/standalone"

export const CANVAS_SIZE = 560
export const PAPER = "#f4efe6"

const nativeScale = brush.scaleBrushes
let appliedScale = 1

function scaleBrushesSafe(factor: number) {
  if (appliedScale !== 1) nativeScale(1 / appliedScale)
  nativeScale(factor)
  appliedScale = factor
}

function resetBrushScale() {
  if (appliedScale === 1) return
  nativeScale(1 / appliedScale)
  appliedScale = 1
}

const sketchBrush = new Proxy(brush, {
  get(target, prop, receiver) {
    if (prop === "scaleBrushes") return scaleBrushesSafe
    return Reflect.get(target, prop, receiver)
  },
})

export function mountCanvas(parent: HTMLElement) {
  parent.replaceChildren()
  return brush.createCanvas(CANVAS_SIZE, CANVAS_SIZE, {
    parent,
    pixelDensity: Math.min(2, window.devicePixelRatio || 1),
    id: "paint-canvas",
  })
}

function resetStyle() {
  resetBrushScale()
  brush.noField()
  brush.noHatch()
  brush.noMass()
  brush.noWash()
  brush.noFill()
  brush.noStroke()
  brush.angleMode(brush.DEGREES)
  brush.clear(PAPER)
}

export function runSketch(source: string) {
  resetStyle()
  const paint = new Function(
    "brush",
    "width",
    "height",
    "random",
    "noise",
    `"use strict";\n${source}`,
  )
  brush.push()
  try {
    paint(sketchBrush, CANVAS_SIZE, CANVAS_SIZE, brush.random, brush.noise)
  } finally {
    for (let i = 0; i < 24; i++) brush.pop()
  }
  brush.render()
}

export function downloadPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, "image/png")
}
