import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Prisma v7+: pass an `adapter` for direct DB connection or `accelerateUrl` for Accelerate
const prisma = new PrismaClient({ adapter: { url: process.env.DATABASE_URL } as any });

async function main() {
  console.log('Seeding demo data...');

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
          bio: 'This is a demo user.'
        }
      }
    },
    include: { profile: true }
  });

  const mentorUser = await prisma.user.upsert({
    where: { email: 'mentor@mindbridge.local' },
    update: {},
    create: {
      email: 'mentor@mindbridge.local',
      passwordHash: 'mentor_password',
      profile: { create: { displayName: 'Alex Mentor', initials: 'AM', bio: 'Experienced peer mentor' } }
    },
    include: { profile: true }
  });

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
      quote: 'Been there, happy to help.'
    }
  });

  const communities = [
    { slug: 'social-media', name: 'Social Media Detox', icon: '📱', accentHex: '#3B5BDB', description: 'Reduce social media use' },
    { slug: 'anxiety', name: 'Anxiety & Stress', icon: '🫁', accentHex: '#C2255C', description: 'Coping strategies and support' },
    { slug: 'alcohol', name: 'Alcohol Recovery', icon: '🍂', accentHex: '#E67700', description: 'Peer and mentor support' }
  ];

  for (const c of communities) {
    await prisma.community.upsert({
      where: { slug: c.slug },
      update: {},
      create: c
    });
  }

  // create a sample post
  const post = await prisma.post.create({
    data: {
      authorId: demoUser.id,
      communitySlug: 'social-media',
      content: 'Hello MindBridge! This is a demo post.',
      isAnonymous: false
    }
  });

  console.log('Seed complete:', { demoUser: demoUser.email, mentorUser: mentorUser.email, postId: post.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
