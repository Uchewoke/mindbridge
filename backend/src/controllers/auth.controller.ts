import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { logUserConsent } from '../services/consent.service.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'mindbridge-dev-secret'
const JWT_EXPIRES = '7d'

function makeToken(userId: string, isAdmin: boolean): string {
  return jwt.sign({ sub: userId, isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

function toAuthUser(user: {
  id: string
  email: string | null
  isAdmin: boolean
  profile: {
    displayName: string | null
    role: string | null
    initials: string | null
  } | null
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.profile?.displayName,
    role: user.profile?.role,
    initials: user.profile?.initials,
    onboarded: Boolean(user.profile?.displayName),
  }
}

export async function signupController(req: Request, res: Response): Promise<void> {
  const {
    name,
    email,
    password,
    role = 'seeker',
  } = req.body as {
    name?: string
    email?: string
    password?: string
    role?: string
  }

  if (!email || !password || !name) {
    res.status(400).json({ message: 'Name, email and password are required.' })
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ message: 'An account with that email already exists.' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          displayName: name,
          initials: name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p: string) => p[0].toUpperCase())
            .join(''),
          role,
        },
      },
    },
    include: { profile: true },
  })

  try {
    await logUserConsent({
      userId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })
  } catch {
    // non-blocking
  }

  const token = makeToken(user.id, false)
  res.status(201).json({
    token,
    user: toAuthUser(user),
  })
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  })

  if (!user || !user.passwordHash) {
    res.status(401).json({ message: 'Invalid email or password.' })
    return
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    res.status(401).json({ message: 'Invalid email or password.' })
    return
  }

  if (!user.isActive) {
    res.status(403).json({ message: 'Your account has been suspended.' })
    return
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } })

  const token = makeToken(user.id, user.isAdmin)
  res.json({
    token,
    isAdmin: user.isAdmin,
    user: toAuthUser(user),
  })
}

export async function meController(req: Request, res: Response): Promise<void> {
  const userId = (req as Request & { userId?: string }).userId

  if (!userId) {
    res.status(401).json({ message: 'Missing authorization token' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  if (!user || !user.isActive) {
    res.status(401).json({ message: 'Invalid or expired token' })
    return
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } })

  res.json({
    isAdmin: user.isAdmin,
    user: toAuthUser(user),
  })
}
