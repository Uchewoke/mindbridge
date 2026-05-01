import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'mindbridge-dev-secret'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization')
  if (!header) {
    res.status(401).json({ message: 'Missing authorization token' })
    return
  }

  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; isAdmin: boolean }
    ;(req as Request & { userId: string; isAdmin: boolean }).userId = payload.sub
    ;(req as Request & { userId: string; isAdmin: boolean }).isAdmin = payload.isAdmin
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
