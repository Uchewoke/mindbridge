export function mockEmbedding(text: string): number[] {
  const chars = text.slice(0, 12).split('')
  return chars.map((ch) => (ch.charCodeAt(0) % 32) / 32)
}
