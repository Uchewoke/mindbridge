import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data...')

  // Admin user — set isAdmin: true so the admin platform accepts login
  await prisma.user.upsert({
    where: { email: 'admin@mindbridge.local' },
    update: {},
    create: {
      email: 'admin@mindbridge.local',
      passwordHash: 'admin_password',
      isAdmin: true,
      profile: {
        create: {
          displayName: 'Platform Admin',
          initials: 'PA',
          bio: 'MindBridge platform administrator.',
        },
      },
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@mindbridge.local' },
    update: {},
    create: {
      email: 'demo@mindbridge.local',
      passwordHash: 'demo_password',
      profile: {
        create: {
          displayName: 'Demo User',
          initials: 'DU',
          bio: 'This is a demo user.',
        },
      },
    },
    include: { profile: true },
  })

  const mentorUser = await prisma.user.upsert({
    where: { email: 'mentor@mindbridge.local' },
    update: {},
    create: {
      email: 'mentor@mindbridge.local',
      passwordHash: 'mentor_password',
      profile: {
        create: { displayName: 'Alex Mentor', initials: 'AM', bio: 'Experienced peer mentor' },
      },
    },
    include: { profile: true },
  })

  await prisma.mentor.upsert({
    where: { userId: mentorUser.id },
    update: {},
    create: {
      userId: mentorUser.id,
      yrs: 5,
      helped: 120,
      rating: 4.8,
      online: true,
      topics: ['anxiety', 'alcohol'],
      style: ['peer'],
      stage: 'recovered',
      avail: 3,
      exp: 80,
      activity: 50,
      quote: 'Been there, happy to help.',
    },
  })

  const communities = [
    {
      slug: 'social-media',
      name: 'Social Media Detox',
      icon: '📱',
      accentHex: '#3B5BDB',
      description: 'Reduce social media use',
    },
    {
      slug: 'anxiety',
      name: 'Anxiety & Stress',
      icon: '🫁',
      accentHex: '#C2255C',
      description: 'Coping strategies and support',
    },
    {
      slug: 'alcohol',
      name: 'Alcohol Recovery',
      icon: '🍂',
      accentHex: '#E67700',
      description: 'Peer and mentor support',
    },
  ]

  for (const c of communities) {
    await prisma.community.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }

  // create a sample post
  const post = await prisma.post.create({
    data: {
      authorId: demoUser.id,
      communitySlug: 'social-media',
      content: 'Hello MindBridge! This is a demo post.',
      isAnonymous: false,
    },
  })

  await prisma.adminDashboardFlag.createMany({
    data: [
      {
        id: 'f1',
        text: 'Possible crisis language detected in direct message',
        user: 'User #4481',
        severity: 'CRISIS',
        time: '2m ago',
      },
      {
        id: 'f2',
        text: 'Harassment report filed in Alcohol Recovery community',
        user: 'Maya R.',
        severity: 'HIGH',
        time: '14m ago',
      },
      {
        id: 'f3',
        text: 'Spam-like rapid posting pattern detected',
        user: 'Anonymous #09',
        severity: 'MEDIUM',
        time: '1h ago',
      },
      {
        id: 'f4',
        text: 'Minor profanity in public support thread',
        user: 'Jordan K.',
        severity: 'LOW',
        time: '3h ago',
      },
    ],
    skipDuplicates: true,
  })

  await prisma.adminDashboardUser.createMany({
    data: [
      { id: 'u1', name: 'Maya Reed', email: 'maya@example.com', role: 'seeker', status: 'active' },
      { id: 'u2', name: 'Ari L.', email: 'ari@example.com', role: 'mentor', status: 'active' },
      {
        id: 'u3',
        name: 'Jordan K.',
        email: 'jordan@example.com',
        role: 'seeker',
        status: 'pending',
      },
      { id: 'u4', name: 'Sam W.', email: 'sam@example.com', role: 'mentor', status: 'suspended' },
      { id: 'u5', name: 'Casey T.', email: 'casey@example.com', role: 'seeker', status: 'active' },
      { id: 'u6', name: 'Robin P.', email: 'robin@example.com', role: 'seeker', status: 'pending' },
    ],
    skipDuplicates: true,
  })

  await prisma.adminDashboardMentor.createMany({
    data: [
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
    skipDuplicates: true,
  })

  console.log('Seed complete:', {
    demoUser: demoUser.email,
    mentorUser: mentorUser.email,
    postId: post.id,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
