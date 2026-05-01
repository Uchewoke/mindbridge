import { NextFunction, Request, Response } from 'express'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.header('authorization')
  if (!token) {
    res.status(401).json({ message: 'Missing authorization token' })
    return
  }
  next()
}
