declare module "p5.brush/standalone" {
  export function createCanvas(
    width: number,
    height: number,
    options?: { pixelDensity?: number; parent?: string | Element | null; id?: string },
  ): HTMLCanvasElement
  export function load(canvas: HTMLCanvasElement | OffscreenCanvas): void
  export function render(): void
  export function clear(...color: unknown[]): void
  export function seed(value: number | string): void
  export function noiseSeed(value: number | string): void
  export function random(a?: number | unknown[], b?: number): number
  export function noise(x: number, y?: number): number
  export function scaleBrushes(factor: number): void
  export function box(): string[]
  export function set(name: string, color: string, weight?: number): void
  export function pick(name: string): void
  export function stroke(...color: unknown[]): void
  export function strokeWeight(weight: number): void
  export function noStroke(): void
  export function fill(...args: unknown[]): void
  export function noFill(): void
  export function fillBleed(strength: number, direction?: string, angle?: number | null): void
  export function fillTexture(texture?: number, border?: number, scatter?: boolean): void
  export function wash(...args: unknown[]): void
  export function noWash(): void
  export function hatch(...args: unknown[]): void
  export function noHatch(): void
  export function hatchStyle(...args: unknown[]): void
  export function mass(...args: unknown[]): void
  export function noMass(): void
  export function field(name: string): void
  export function noField(): void
  export function line(x1: number, y1: number, x2: number, y2: number): void
  export function flowLine(x: number, y: number, length: number, angle: number): void
  export function circle(x: number, y: number, radius: number, randomize?: boolean): unknown
  export function rect(x: number, y: number, w: number, h: number, mode?: string): void
  export function arc(x: number, y: number, radius: number, start: number, end: number): unknown
  export function polygon(points: number[][]): unknown
  export function beginShape(kind?: number): void
  export function vertex(x: number, y: number, pressure?: number): void
  export function endShape(close?: boolean): unknown
  export function beginStroke(x: number, y: number): void
  export function move(x: number, y: number): void
  export function endStroke(): void
  export function spline(...args: unknown[]): unknown
  export function push(): void
  export function pop(): void
  export function translate(x: number, y: number): void
  export function rotate(angle: number): void
  export function scale(x: number, y?: number): void
  export function angleMode(mode: string): void
  export const DEGREES: string
  export const RADIANS: string
  export function clip(...args: unknown[]): void
  export function noClip(): void
  export function add(...args: unknown[]): unknown
  export function addField(...args: unknown[]): void
}
