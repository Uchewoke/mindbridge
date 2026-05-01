import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type SafetyEventType = 'flagged_message' | 'crisis_detection' | 'user_report'

export interface SafetyEventInput {
  userId?: string
  type: SafetyEventType
  content?: string
}

export async function createSafetyEvent(input: SafetyEventInput) {
  return prisma.safetyEvent.create({
    data: {
      userId: input.userId ?? null,
      type: input.type,
      content: input.content ?? null,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      content: true,
      createdAt: true,
    },
  })
}

export async function listSafetyEvents(limit = 100) {
  return prisma.safetyEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 500),
    select: {
      id: true,
      userId: true,
      type: true,
      content: true,
      createdAt: true,
    },
  })
}

export async function getSafetySummary() {
  const grouped = await prisma.safetyEvent.groupBy({
    by: ['type'],
    _count: { _all: true },
  })

  const summary = {
    flagged_message: 0,
    crisis_detection: 0,
    user_report: 0,
  }

  for (const row of grouped) {
    if (row.type in summary) {
      summary[row.type as keyof typeof summary] = row._count._all
    }
  }

  return summary
}
