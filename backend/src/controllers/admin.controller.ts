import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { listSafetyReports, getSafetyReportsSummary } from '../services/safety/reporting.service.js'
import {
  getAdminDashboardState,
  updateAdminFlagAction,
  updateAdminMentorStatus,
  updateAdminUserStatus,
} from '../services/admin/adminState.service.js'

const prisma = new PrismaClient()

export async function listReportsController(_req: Request, res: Response): Promise<void> {
  const [events, summary] = await Promise.all([listSafetyReports(), getSafetyReportsSummary()])
  res.json({ events, summary })
}

export async function getDashboardStateController(_req: Request, res: Response): Promise<void> {
  const state = await getAdminDashboardState()
  res.json(state)
}

export async function listUsersController(_req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { profile: true },
  })
  res.json({ users })
}

export async function toggleUserActiveController(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const { isActive } = req.body as { isActive: boolean }
  const updated = await prisma.user.update({
    where: { id },
    data: { isActive },
  })
  res.json({ ok: true, user: updated })
}

export async function getStatsController(_req: Request, res: Response): Promise<void> {
  const [totalUsers, activeUsers, mentors, posts, sessions, safetyEvents, openFlags] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.mentor.count(),
      prisma.post.count(),
      prisma.session.count(),
      prisma.safetyEvent.count(),
      prisma.adminFlag.count({ where: { isResolved: false } }),
    ])

  res.json({ totalUsers, activeUsers, mentors, posts, sessions, safetyEvents, openFlags })
}

export async function listFlagsController(_req: Request, res: Response): Promise<void> {
  const flags = await prisma.adminFlag.findMany({
    orderBy: { createdAt: 'desc' },
    include: { creator: { include: { profile: true } } },
  })
  res.json({ flags })
}

export async function resolveFlagController(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  const updated = await prisma.adminFlag.update({
    where: { id },
    data: { isResolved: true, resolvedAt: new Date() },
  })
  res.json({ ok: true, flag: updated })
}

export async function updateDashboardFlagController(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  const { action } = req.body as { action: 'dismissed' | 'removed' | 'crisis-alerted' }

  try {
    const flags = await updateAdminFlagAction(id, action)
    res.json({ ok: true, flags })
  } catch (error) {
    res
      .status(404)
      .json({ ok: false, error: error instanceof Error ? error.message : 'Flag not found' })
  }
}

export async function updateDashboardUserController(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  const { status } = req.body as { status: 'active' | 'pending' | 'suspended' | 'denied' }

  try {
    const user = await updateAdminUserStatus(id, status)
    res.json({ ok: true, user })
  } catch (error) {
    res
      .status(404)
      .json({ ok: false, error: error instanceof Error ? error.message : 'User not found' })
  }
}

export async function updateDashboardMentorController(req: Request, res: Response): Promise<void> {
  const id = req.params.id
  const { status } = req.body as { status: 'pending' | 'verified' | 'denied' }

  try {
    const mentor = await updateAdminMentorStatus(id, status)
    res.json({ ok: true, mentor })
  } catch (error) {
    res
      .status(404)
      .json({ ok: false, error: error instanceof Error ? error.message : 'Mentor not found' })
  }
}
