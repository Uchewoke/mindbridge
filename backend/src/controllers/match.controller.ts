import { Request, Response } from 'express'
import { rankMentors } from '../services/matching/mentor.matcher.js'

const MOCK_MENTORS = [
  {
    id: 'mentor_1',
    displayName: 'Dr. Amara Osei',
    initials: 'AO',
    avatar: 'linear-gradient(135deg,#667eea,#764ba2)',
    role: 'Peer Mentor · Trauma Recovery',
    quote: 'Healing is not linear — and that is okay.',
    bio: 'Certified peer specialist with 8 years supporting survivors of trauma.',
    yrs: 8,
    helped: 142,
    rating: 4.9,
    online: true,
    topics: ['trauma', 'anxiety', 'resilience'],
    style: ['empathetic', 'structured'],
    stage: 'recovered',
    tags: [
      ['rc', 'Trauma Recovery'],
      ['ax', 'CBT-informed'],
    ],
    profile: 'trauma-informed guidance resilience anxiety recovery',
  },
  {
    id: 'mentor_2',
    displayName: 'Marcus Webb',
    initials: 'MW',
    avatar: 'linear-gradient(135deg,#f093fb,#f5576c)',
    role: 'Peer Mentor · Accountability',
    quote: 'Small consistent actions create lasting change.',
    bio: 'Recovered from burnout; now helping others build sustainable habits.',
    yrs: 5,
    helped: 89,
    rating: 4.7,
    online: false,
    topics: ['burnout', 'motivation', 'habits'],
    style: ['direct', 'goal-oriented'],
    stage: 'stabilised',
    tags: [
      ['sk', 'Habit Building'],
      ['rc', 'Burnout Recovery'],
    ],
    profile: 'accountability structure motivation goal habits burnout',
  },
  {
    id: 'mentor_3',
    displayName: 'Priya Nair',
    initials: 'PN',
    avatar: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    role: 'Peer Mentor · Grief & Loss',
    quote: 'Your grief is valid. You do not have to carry it alone.',
    bio: 'Navigated profound personal loss and trained in grief peer support.',
    yrs: 4,
    helped: 61,
    rating: 4.8,
    online: true,
    topics: ['grief', 'loss', 'depression'],
    style: ['empathetic', 'gentle'],
    stage: 'recovering',
    tags: [
      ['ax', 'Grief Support'],
      ['sk', 'Mindfulness'],
    ],
    profile: 'grief loss depression empathy compassion mindfulness',
  },
]

function seekerSummary(seeker: Record<string, unknown>): string {
  const parts: string[] = []
  if (Array.isArray(seeker.topics)) parts.push(...(seeker.topics as string[]))
  if (seeker.style) parts.push(String(seeker.style))
  if (seeker.stage) parts.push(String(seeker.stage))
  return parts.join(' ') || 'mental health peer support'
}

function matchReasons(mentor: (typeof MOCK_MENTORS)[0], score: number): string[] {
  const reasons: string[] = []
  if (score > 0.7) reasons.push('High compatibility')
  if (mentor.online) reasons.push('Available now')
  if (mentor.rating >= 4.8) reasons.push('Top rated')
  if (mentor.helped > 100) reasons.push('Highly experienced')
  return reasons
}

export function getMatchesController(req: Request, res: Response): void {
  const profile = String(req.query.profile ?? 'resilience and recovery')
  const mentors = MOCK_MENTORS.map((m) => ({ id: m.id, profile: m.profile }))
  res.json({ matches: rankMentors(profile, mentors) })
}

export function postMentorMatchController(req: Request, res: Response): void {
  const { seeker = {}, weights = {} } = req.body as {
    seeker?: Record<string, unknown>
    weights?: Record<string, number>
  }

  const summary = seekerSummary(seeker)
  const ranked = rankMentors(
    summary,
    MOCK_MENTORS.map((m) => ({ id: m.id, profile: m.profile })),
  )

  const matches = ranked.map(({ mentorId, score }) => {
    const mentor = MOCK_MENTORS.find((m) => m.id === mentorId)!
    const weightedScore = Math.round(score * 100)
    return {
      mentor,
      score: weightedScore,
      reasons: matchReasons(mentor, score),
      components: weights,
    }
  })

  res.json({ data: { matches, meta: { total: matches.length } } })
}
