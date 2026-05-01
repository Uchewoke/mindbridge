import { NextFunction, Request, Response } from 'express'
import { moderateMessage } from '../services/safety/moderation.service.js'

export function safetyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const message = String(req.body?.message ?? '')
  if (!message) {
    next()
    return
  }

  const result = moderateMessage(message)
  if (!result.approved) {
    res.status(400).json({ message: 'Message blocked', reasons: result.reasons })
    return
  }

  next()
}
