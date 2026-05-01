import { PrismaClient } from '@prisma/client'

type AdminFlagResolution = 'dismissed' | 'removed' | 'crisis-alerted'
type AdminUserStatus = 'active' | 'pending' | 'suspended' | 'denied'
type AdminMentorStatus = 'pending' | 'verified' | 'denied'

type PersistedFlag = {
  id: string
  text: string
  user: string
  severity: string
  time: string
  resolved: boolean
  resolution: AdminFlagResolution | null
  resolvedAt: string | null
}

type PersistedUser = {
  id: string
  name: string
  email: string
  role: string
  status: AdminUserStatus
}

type PersistedMentor = {
  id: string
  name: string
  specialty: string
  status: AdminMentorStatus
  story: string
}

type AdminState = {
  flags: PersistedFlag[]
  users: PersistedUser[]
  mentors: PersistedMentor[]
}

const prisma = new PrismaClient()

const DEFAULT_ADMIN_STATE: AdminState = {
  flags: [
    {
      id: 'f1',
      text: 'Possible crisis language detected in direct message',
      user: 'User #4481',
      severity: 'CRISIS',
      time: '2m ago',
      resolved: false,
      resolution: null,
      resolvedAt: null,
    },
    {
      id: 'f2',
      text: 'Harassment report filed in Alcohol Recovery community',
      user: 'Maya R.',
      severity: 'HIGH',
      time: '14m ago',
      resolved: false,
      resolution: null,
      resolvedAt: null,
    },
    {
      id: 'f3',
      text: 'Spam-like rapid posting pattern detected',
      user: 'Anonymous #09',
      severity: 'MEDIUM',
      time: '1h ago',
      resolved: false,
      resolution: null,
      resolvedAt: null,
    },
    {
      id: 'f4',
      text: 'Minor profanity in public support thread',
      user: 'Jordan K.',
      severity: 'LOW',
      time: '3h ago',
      resolved: false,
      resolution: null,
      resolvedAt: null,
    },
  ],
  users: [
    { id: 'u1', name: 'Maya Reed', email: 'maya@example.com', role: 'seeker', status: 'active' },
    { id: 'u2', name: 'Ari L.', email: 'ari@example.com', role: 'mentor', status: 'active' },
    { id: 'u3', name: 'Jordan K.', email: 'jordan@example.com', role: 'seeker', status: 'pending' },
    { id: 'u4', name: 'Sam W.', email: 'sam@example.com', role: 'mentor', status: 'suspended' },
    { id: 'u5', name: 'Casey T.', email: 'casey@example.com', role: 'seeker', status: 'active' },
    { id: 'u6', name: 'Robin P.', email: 'robin@example.com', role: 'seeker', status: 'pending' },
  ],
  mentors: [
    {
      id: 'm1',
      name: 'Dr. Sarah K.',
      specialty: 'Addiction',
      status: 'pending',
      story:
        'Certified addiction counselor with 8 years of clinical experience in outpatient treatment programs.',
    },
    {
      id: 'm2',
      name: 'Marcus T.',
      specialty: 'Anxiety',
      status: 'pending',
      story:
        'Five-year recovery from debilitating anxiety disorders. Peer support specialist certification, 2021.',
    },
    {
      id: 'm3',
      name: 'Priya N.',
      specialty: 'Grief',
      status: 'verified',
      story: 'Licensed clinical social worker specialising in bereavement and traumatic loss.',
    },
    {
      id: 'm4',
      name: 'Lena H.',
      specialty: 'Trauma',
      status: 'pending',
      story: 'Trauma-informed coach with lived CPTSD experience. Somatic therapy trained.',
    },
    {
      id: 'm5',
      name: 'Carlos M.',
      specialty: 'Depression',
      status: 'verified',
      story: 'Psychiatric nurse practitioner and depression recovery advocate for 10+ years.',
    },
  ],
}

async function ensureDashboardSeeded(): Promise<void> {
  const [flagCount, userCount, mentorCount] = await Promise.all([
    prisma.adminDashboardFlag.count(),
    prisma.adminDashboardUser.count(),
    prisma.adminDashboardMentor.count(),
  ])

  const jobs: Promise<unknown>[] = []

  if (flagCount === 0) {
    jobs.push(
      prisma.adminDashboardFlag.createMany({
        data: DEFAULT_ADMIN_STATE.flags.map((flag) => ({
          id: flag.id,
          text: flag.text,
          user: flag.user,
          severity: flag.severity,
          time: flag.time,
          resolved: flag.resolved,
          resolution: flag.resolution,
          resolvedAt: flag.resolvedAt ? new Date(flag.resolvedAt) : null,
        })),
      }),
    )
  }

  if (userCount === 0) {
    jobs.push(prisma.adminDashboardUser.createMany({ data: DEFAULT_ADMIN_STATE.users }))
  }

  if (mentorCount === 0) {
    jobs.push(prisma.adminDashboardMentor.createMany({ data: DEFAULT_ADMIN_STATE.mentors }))
  }

  if (jobs.length > 0) await Promise.all(jobs)
}

export async function getAdminDashboardState(): Promise<AdminState> {
  await ensureDashboardSeeded()

  const [flags, users, mentors] = await Promise.all([
    prisma.adminDashboardFlag.findMany({
      where: { resolved: false },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.adminDashboardUser.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.adminDashboardMentor.findMany({ orderBy: { createdAt: 'asc' } }),
  ])

  return {
    flags: flags.map((flag) => ({
      id: flag.id,
      text: flag.text,
      user: flag.user,
      severity: flag.severity,
      time: flag.time,
      resolved: flag.resolved,
      resolution: (flag.resolution as AdminFlagResolution | null) ?? null,
      resolvedAt: flag.resolvedAt?.toISOString() ?? null,
    })),
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status as AdminUserStatus,
    })),
    mentors: mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.name,
      specialty: mentor.specialty,
      status: mentor.status as AdminMentorStatus,
      story: mentor.story,
    })),
  }
}

export async function updateAdminFlagAction(
  id: string,
  resolution: AdminFlagResolution,
): Promise<PersistedFlag[]> {
  await ensureDashboardSeeded()

  const existing = await prisma.adminDashboardFlag.findUnique({ where: { id } })
  if (!existing) throw new Error('Flag not found')

  await prisma.adminDashboardFlag.update({
    where: { id },
    data: {
      resolved: true,
      resolution,
      resolvedAt: new Date(),
    },
  })

  const flags = await prisma.adminDashboardFlag.findMany({
    where: { resolved: false },
    orderBy: { createdAt: 'asc' },
  })

  return flags.map((flag) => ({
    id: flag.id,
    text: flag.text,
    user: flag.user,
    severity: flag.severity,
    time: flag.time,
    resolved: flag.resolved,
    resolution: (flag.resolution as AdminFlagResolution | null) ?? null,
    resolvedAt: flag.resolvedAt?.toISOString() ?? null,
  }))
}

export async function updateAdminUserStatus(
  id: string,
  status: AdminUserStatus,
): Promise<PersistedUser> {
  await ensureDashboardSeeded()

  const existing = await prisma.adminDashboardUser.findUnique({ where: { id } })
  if (!existing) throw new Error('User not found')

  const user = await prisma.adminDashboardUser.update({
    where: { id },
    data: { status },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status as AdminUserStatus,
  }
}

export async function updateAdminMentorStatus(
  id: string,
  status: AdminMentorStatus,
): Promise<PersistedMentor> {
  await ensureDashboardSeeded()

  const existing = await prisma.adminDashboardMentor.findUnique({ where: { id } })
  if (!existing) throw new Error('Mentor not found')

  const mentor = await prisma.adminDashboardMentor.update({
    where: { id },
    data: { status },
  })

  return {
    id: mentor.id,
    name: mentor.name,
    specialty: mentor.specialty,
    status: mentor.status as AdminMentorStatus,
    story: mentor.story,
  }
}
