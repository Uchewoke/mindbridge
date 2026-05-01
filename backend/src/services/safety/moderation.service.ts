const DEFAULT_BANNED_WORDS = ['hate', 'violence']

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseBannedWordsFromEnv(): string[] {
  const raw = process.env.MODERATION_BANNED_WORDS
  if (!raw) return DEFAULT_BANNED_WORDS

  const words = raw
    .split(',')
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean)

  return words.length ? words : DEFAULT_BANNED_WORDS
}

function buildWordPattern(word: string): RegExp {
  // Support exact words/phrases and avoid substring false positives.
  const phrase = escapeRegex(word).replace(/\s+/g, '\\s+')
  return new RegExp(`\\b${phrase}\\b`, 'i')
}

export function moderateMessage(
  message: string,
  options?: { bannedWords?: string[] },
): { approved: boolean; reasons: string[] } {
  const bannedWords =
    options?.bannedWords?.map((word) => word.toLowerCase()).filter(Boolean) ??
    parseBannedWordsFromEnv()

  const matchedWords = bannedWords.filter((word) => buildWordPattern(word).test(message))

  return {
    approved: matchedWords.length === 0,
    reasons: matchedWords.map((word) => `Contains banned language: ${word}`),
  }
}
