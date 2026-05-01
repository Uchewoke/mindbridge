import { NextFunction, Request, Response } from 'express'

const hits = new Map<string, { count: number; windowStart: number }>()

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip || 'unknown'
  const now = Date.now()
  const item = hits.get(key) ?? { count: 0, windowStart: now }
  if (now - item.windowStart > 60_000) {
    item.count = 0
    item.windowStart = now
  }
  item.count += 1
  hits.set(key, item)

  if (item.count > 120) {
    res.status(429).json({ message: 'Rate limit exceeded' })
    return
  }
  next()
}
