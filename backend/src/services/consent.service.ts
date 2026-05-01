import { prisma } from '../lib/prisma.js'

export interface LogConsentInput {
  userId: string
  ipAddress?: string
  userAgent?: string
}

export async function logUserConsent(input: LogConsentInput): Promise<void> {
  await prisma.userConsent.create({
    data: {
      userId: input.userId,
      agreedToTerms: true,
      agreedToPrivacy: true,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  })
}
