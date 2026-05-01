const crisisPatterns = [/self-harm/i, /suicide/i, /hurt myself/i]

export function containsCrisisLanguage(input: string): boolean {
  return crisisPatterns.some((pattern) => pattern.test(input))
}
