// Patterns that indicate an attempt to override or jailbreak the system prompt
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /you\s+are\s+now\s+(a|an)?\s*(different|new|unrestricted|evil|dan)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(doctor|therapist|clinician|diagnos)/i,
  /act\s+as\s+(a\s+)?(doctor|therapist|clinician|diagnos)/i,
  /do\s+anything\s+now/i,
  /disregard\s+(your\s+)?(rules|guidelines|instructions)/i,
]

// Patterns that should be handled by crisis detection, added here as a defence-in-depth layer
const HARMFUL_REQUEST_PATTERNS = [
  /how\s+to\s+(kill|hurt|harm)\s+(myself|yourself|someone)/i,
  /methods?\s+(of|to)\s+(suicide|self.harm)/i,
  /give\s+me\s+a\s+diagnosis/i,
  /diagnose\s+me/i,
]

export function applyPromptGuardrails(input: string): string {
  const trimmed = input.trim().slice(0, 4000)

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return '[Message blocked by content policy]'
    }
  }

  for (const pattern of HARMFUL_REQUEST_PATTERNS) {
    if (pattern.test(trimmed)) {
      return '[Message blocked by content policy]'
    }
  }

  return trimmed
}
