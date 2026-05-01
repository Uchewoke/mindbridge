import { Request, Response } from 'express'
import { logUserConsent } from '../services/consent.service.js'

export function loginController(req: Request, res: Response): void {
  const { email } = req.body as { email?: string }
  const isAdmin = email?.toLowerCase() === 'admin@mindbridge.local'

  // TODO: replace with real credential verification and JWT signing.
  // For now this returns a demo token; the isAdmin flag mirrors what would
  // be stored in the DB / JWT claims for the requesting user.
  res.json({ token: 'demo-token', userId: 'user_1', isAdmin })
}

export async function signupController(req: Request, res: Response): Promise<void> {
  const { agreed, userId } = req.body as { agreed?: boolean; userId?: string }

  if (!agreed) {
    res
      .status(400)
      .json({ error: 'Consent required. You must agree to the Terms and Privacy Policy.' })
    return
  }

  // TODO: replace with real user creation once auth is wired up.
  // userId comes from the created user record; hardcoded here for demo.
  const resolvedUserId: string = userId ?? 'user_1'

  try {
    await logUserConsent({
      userId: resolvedUserId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })
  } catch (err) {
    // Log but do not block signup — consent table may not be migrated yet in dev
    console.error('[consent] Failed to log consent:', err)
  }

  res.status(201).json({ created: true })
}
