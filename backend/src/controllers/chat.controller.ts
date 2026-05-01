import { Request, Response } from 'express'
import { applyPromptGuardrails } from '../services/ai/prompt.guardrails.js'
import { generateSupportiveReply } from '../services/ai/openai.service.js'
import { moderateMessage } from '../services/safety/moderation.service.js'
import { detectCrisisRisk, CRISIS_RESPONSE } from '../services/ai/crisis.detect.js'
import { createSafetyEvent } from '../services/safety/events.service.js'

export async function sendChatMessageController(req: Request, res: Response): Promise<void> {
  const message = String(req.body?.message ?? '')

  // Crisis detection — short-circuit before moderation and AI
  if (detectCrisisRisk(message)) {
    void createSafetyEvent({
      type: 'crisis_detection',
      content: message,
    }).catch(() => undefined)

    res.json({ type: 'crisis', message: CRISIS_RESPONSE })
    return
  }

  const moderated = moderateMessage(message)

  if (!moderated.approved) {
    void createSafetyEvent({
      type: 'flagged_message',
      content: message,
    }).catch(() => undefined)

    res.status(400).json({ ok: false, reasons: moderated.reasons })
    return
  }

  const safeInput = applyPromptGuardrails(message)
  const reply = await generateSupportiveReply(safeInput)
  res.json({ type: 'normal', message: reply })
}
