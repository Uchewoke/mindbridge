import { Request, Response } from 'express'
import { z } from 'zod'
import { sendSupportMoment } from '../services/push/expo.push.service.js'
import {
  getAllTokens,
  getTokensForUser,
  removePushToken,
  storePushToken,
} from '../services/push/token.store.js'

const RegisterTokenSchema = z.object({
  token: z
    .string()
    .min(1)
    .regex(/^ExponentPushToken\[.+\]$/, 'Must be a valid Expo push token'),
})

const SendSupportMomentSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  /** Optional: target a specific user ID.  Omit to broadcast to all tokens. */
  userId: z.string().optional(),
})

/** POST /api/notifications/push-token */
export async function registerPushTokenController(req: Request, res: Response): Promise<void> {
  const parsed = RegisterTokenSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() })
    return
  }

  // req.user is set by authMiddleware
  const userId: string = (req as Request & { user?: { id: string } }).user?.id ?? 'anonymous'
  storePushToken(userId, parsed.data.token)

  res.json({ ok: true })
}

/** DELETE /api/notifications/push-token */
export async function deregisterPushTokenController(req: Request, res: Response): Promise<void> {
  const parsed = RegisterTokenSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() })
    return
  }

  removePushToken(parsed.data.token)
  res.json({ ok: true })
}

/**
 * POST /api/notifications/support-moment
 * Admin-only: send a support moment push notification.
 */
export async function sendSupportMomentController(req: Request, res: Response): Promise<void> {
  const parsed = SendSupportMomentSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ ok: false, errors: parsed.error.flatten() })
    return
  }

  const { title, body, userId } = parsed.data

  const tokens = userId ? getTokensForUser(userId) : getAllTokens()

  if (tokens.length === 0) {
    res.json({ ok: true, sent: 0, message: 'No registered tokens found.' })
    return
  }

  const tickets = await sendSupportMoment(tokens, title, body)
  const failed = tickets.filter((t) => t.status === 'error')

  res.json({
    ok: true,
    sent: tickets.length,
    failed: failed.length,
    tickets,
  })
}
