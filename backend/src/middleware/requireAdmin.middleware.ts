import { NextFunction, Request, Response } from 'express'

/**
 * Middleware that allows only requests where the decoded token indicates an
 * admin user.  Relies on authMiddleware having already run.
 *
 * The user object is attached to `req` by the auth middleware.  When a real
 * JWT implementation is added this check should verify the decoded claims.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = (req as Request & { user?: { isAdmin?: boolean } }).user

  if (!user?.isAdmin) {
    res.status(403).json({ ok: false, message: 'Admin access required.' })
    return
  }

  next()
}
