const crisisPatterns = [
  /self[- ]?harm/i,
  /suicide/i,
  /suicidal/i,
  /hurt myself/i,
  /kill myself/i,
  /end my life/i,
  /i want to die/i,
  /i don'?t want to live/i,
  /take my (own )?life/i,
  /no reason to live/i,
  /better off (without me|dead)/i,
]

export const CRISIS_RESPONSE =
  'If you are in immediate danger, please call 911 or contact the ' +
  '988 Suicide & Crisis Lifeline (call or text 988). You are not alone.'

export function detectCrisisRisk(message: string): boolean {
  return crisisPatterns.some((pattern) => pattern.test(message))
}
