export function buildGeneratePrompt(subjectPrompt: string): string {
  const subject = subjectPrompt.trim()
  return [
    subject,
    "This is frame 1 of a stop-motion sequence. Neutral pose, still camera, consistent studio lighting.",
    "Keep the subject fully visible. No text, captions, watermarks, or borders.",
  ].join(" ")
}

export function buildEditPrompt(
  motionPrompt: string,
  frameIndex: number,
  frameCount: number,
): string {
  const motion = motionPrompt.trim()
  return [
    "Keep the same character, costume, proportions, materials, background, camera angle, framing, lighting, and art style as the input image.",
    "Do not restyle, redesign, or change identity.",
    `Apply only the next micro-motion for frame ${frameIndex} of ${frameCount}`,
    `(a small incremental change from the previous frame toward this action): ${motion}`,
  ].join(" ")
}
