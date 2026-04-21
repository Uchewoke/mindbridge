/**
 * @file fixtures.js
 * Shared in-memory fixture data used by MSW handlers.
 * All shapes conform to the contracts defined in src/api/contracts.js.
 */

// ---------------------------------------------------------------------------
// Auth fixtures
// ---------------------------------------------------------------------------

/** @type {import('./contracts').AuthUser} */
export const AUTH_USER = {
  id: 'u-maya-001',
  name: 'Maya Reed',
  email: 'maya@example.com',
  role: 'seeker',
  status: 'active',
  avatar: 'linear-gradient(135deg,#667eea,#764ba2)',
  createdAt: '2025-11-01T08:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Mentor fixtures (backend schema — normalised by toUiMentor in production)
// ---------------------------------------------------------------------------

/** @type {import('./contracts').MentorBackend} */
const MENTOR_ARI = {
  id: 'm-ari-001',
  displayName: 'Ari L.',
  stage: 'recovered',
  role: 'Mentor',
  tags: [['so', 'Social Media'], ['mn', 'Mentor'], ['ve', 'Verified']],
  profile: {
    avatarUrl: null,
    quote: 'Progress is repetition, not perfection.',
    bio: 'Recovered from compulsive scrolling and panic spirals. Now I help others build the same healthy digital boundaries that changed my life.',
  },
  expertise: {
    topics: ['social-media', 'anxiety', 'digital-wellness'],
    styles: ['reflective', 'gentle-accountability'],
    specialties: ['habit-change', 'cognitive-reframing'],
  },
  stats: {
    ratingAvg: 4.9,
    sessionsCompleted: 184,
    responseTimeMinutesP50: 18,
    activityScore30d: 88,
  },
  availability: { online: true, capacityOpen: 6, officeHours: 'Weeknights 7-10 PM EST' },
  credentials: { yearsExperience: 3, verificationStatus: 'verified', certifications: [] },
}

/** @type {import('./contracts').MentorBackend} */
const MENTOR_SAM = {
  id: 'm-sam-002',
  displayName: 'Coach Sam',
  stage: 'professional',
  role: 'Professional Mentor',
  tags: [['th', 'CBT Trained'], ['mn', 'Mentor'], ['ve', 'Verified']],
  profile: {
    avatarUrl: null,
    quote: 'Small steps close big gaps.',
    bio: 'Licensed counsellor specialising in anxiety and recovery frameworks. CBT trained with 7 years of peer-support coaching.',
  },
  expertise: {
    topics: ['anxiety', 'depression', 'relationships', 'self-esteem'],
    styles: ['structured', 'evidence-based', 'gentle-accountability'],
    specialties: ['CBT', 'mindfulness', 'trauma-informed'],
  },
  stats: {
    ratingAvg: 4.8,
    sessionsCompleted: 312,
    responseTimeMinutesP50: 25,
    activityScore30d: 95,
  },
  availability: { online: false, capacityOpen: 2, officeHours: 'Weekdays 9 AM – 1 PM EST' },
  credentials: {
    yearsExperience: 7,
    verificationStatus: 'verified',
    certifications: ['LCSW', 'CBT-C'],
  },
}

/** @type {import('./contracts').MentorBackend} */
const MENTOR_PRIYA = {
  id: 'm-priya-003',
  displayName: 'Priya M.',
  stage: 'mid-recovery',
  role: 'Mentor',
  tags: [['gr', 'Grief & Loss'], ['mn', 'Mentor']],
  profile: {
    avatarUrl: null,
    quote: 'Grief is love with nowhere to go — let\'s find somewhere together.',
    bio: 'Navigating mid-recovery from loss-related depression. I offer a non-judgmental space for anyone processing grief.',
  },
  expertise: {
    topics: ['grief', 'relationships', 'depression'],
    styles: ['empathetic', 'reflective'],
    specialties: ['loss-processing', 'emotional-regulation'],
  },
  stats: {
    ratingAvg: 4.7,
    sessionsCompleted: 72,
    responseTimeMinutesP50: 42,
    activityScore30d: 71,
  },
  availability: { online: true, capacityOpen: 4, officeHours: 'Weekends 10 AM – 4 PM EST' },
  credentials: { yearsExperience: 1, verificationStatus: 'verified', certifications: [] },
}

export const MENTOR_CATALOG = [MENTOR_ARI, MENTOR_SAM, MENTOR_PRIYA]

// ---------------------------------------------------------------------------
// Match result fixtures (include score + reasons alongside mentor)
// ---------------------------------------------------------------------------

/** @type {import('./contracts').MatchItem[]} */
export const MATCH_RESULTS = [
  {
    mentor: MENTOR_ARI,
    score: 91,
    reasons: ['Shared focus topics', 'Support style aligns', 'Strong recent availability'],
    components: { topics: 95, style: 88, stage: 95, availability: 86, quality: 90, safetyPenalty: 0 },
  },
  {
    mentor: MENTOR_SAM,
    score: 85,
    reasons: ['Covers your main concerns', 'Evidence-based approach', 'Highly experienced'],
    components: { topics: 80, style: 82, stage: 75, availability: 50, quality: 97, safetyPenalty: 0 },
  },
  {
    mentor: MENTOR_PRIYA,
    score: 68,
    reasons: ['Shared experience with relationships topic', 'Empathetic style'],
    components: { topics: 60, style: 72, stage: 80, availability: 78, quality: 72, safetyPenalty: 0 },
  },
]

// ---------------------------------------------------------------------------
// Feed fixtures
// ---------------------------------------------------------------------------

/** @type {import('./contracts').FeedPost[]} */
export let POSTS = [
  {
    id: 'p-001',
    authorId: 'u-maya-001',
    authorName: 'Maya Reed',
    anonymous: false,
    category: 'anxiety',
    content: 'Finally had a full day without checking Instagram every 10 minutes. Small win but it felt huge. What helped me was setting a 20-min "phone-free" morning block.',
    likes: 12,
    likedByMe: false,
    comments: 4,
    createdAt: '2026-04-12T10:30:00.000Z',
  },
  {
    id: 'p-002',
    authorId: 'u-anon-999',
    authorName: 'Anonymous',
    anonymous: true,
    category: 'recovery',
    content: 'Three months clean from self-harm. Some days are still hard but I\'m proud of how far I\'ve come. Thank you to everyone in this community.',
    likes: 47,
    likedByMe: false,
    comments: 11,
    createdAt: '2026-04-11T18:15:00.000Z',
  },
  {
    id: 'p-003',
    authorId: 'u-alex-042',
    authorName: 'Alex T.',
    anonymous: false,
    category: 'general',
    content: 'Reminder that rest is productive. You\'re not falling behind; you\'re recharging.',
    likes: 89,
    likedByMe: false,
    comments: 21,
    createdAt: '2026-04-10T09:00:00.000Z',
  },
]

// ---------------------------------------------------------------------------
// Admin — flags
// ---------------------------------------------------------------------------

/** @type {import('./contracts').AdminFlag[]} */
export let FLAGS = [
  {
    id: 'f-001',
    severity: 'CRISIS',
    status: 'pending',
    type: 'Post',
    user: 'Jordan K.',
    content: 'I don\'t want to be here anymore. Nothing helps.',
    time: '2026-04-13T07:42:00.000Z',
  },
  {
    id: 'f-002',
    severity: 'HIGH',
    status: 'pending',
    type: 'Message',
    user: 'Unknown',
    content: 'Encouraging harmful behaviours in private chat.',
    time: '2026-04-13T05:10:00.000Z',
  },
  {
    id: 'f-003',
    severity: 'MEDIUM',
    status: 'pending',
    type: 'Comment',
    user: 'Sam D.',
    content: 'This comment minimises the lived experiences of others.',
    time: '2026-04-12T22:05:00.000Z',
  },
  {
    id: 'f-004',
    severity: 'LOW',
    status: 'reviewed',
    type: 'Post',
    user: 'Riley P.',
    content: 'Possible spam / promotional content.',
    time: '2026-04-12T14:30:00.000Z',
  },
]

// ---------------------------------------------------------------------------
// Communities
// ---------------------------------------------------------------------------

export let COMMUNITIES = [
  {
    slug: 'social-media',
    name: 'Social Media Detox',
    icon: '📱',
    accentHex: '#3B5BDB',
    desc: 'Build healthier phone habits without shame.',
    members: 5200,
    online: 211,
    posts: ['Two-hour screen-free mornings challenge', 'Turn off infinite feeds after 9pm'],
    createdByMe: false,
  },
  {
    slug: 'anxiety',
    name: 'Anxiety & Stress',
    icon: '🫁',
    accentHex: '#C2255C',
    desc: 'Grounding, breathwork, and support loops.',
    members: 4100,
    online: 188,
    posts: ['4-7-8 breathing room is live tonight', 'Share your emergency calm kit'],
    createdByMe: false,
  },
  {
    slug: 'alcohol',
    name: 'Alcohol Recovery',
    icon: '🍂',
    accentHex: '#E67700',
    desc: 'Daily accountability and relapse prevention.',
    members: 3600,
    online: 144,
    posts: ['Weekend plan thread', 'One month sober milestone check-in'],
    createdByMe: false,
  },
  {
    slug: 'depression',
    name: 'Depression Support',
    icon: '🌧️',
    accentHex: '#7048E8',
    desc: 'Soft support, routines, and tiny wins.',
    members: 3000,
    online: 122,
    posts: ['What helped you get out of bed today?', 'Low-energy meals list'],
    createdByMe: false,
  },
  {
    slug: 'gaming',
    name: 'Gaming & Balance',
    icon: '🎮',
    accentHex: '#0CA678',
    desc: 'Play intentionally while protecting sleep and goals.',
    members: 2800,
    online: 136,
    posts: ['Nightly queue cut-off challenge', 'Alternative reward ideas'],
    createdByMe: false,
  },
  {
    slug: 'loneliness',
    name: 'Loneliness & Connection',
    icon: '🤝',
    accentHex: '#5B21B6',
    desc: 'Connection rituals and social confidence practice.',
    members: 3300,
    online: 165,
    posts: ['One message a day challenge', 'Weekly buddy walk thread'],
    createdByMe: false,
  },
]

// ---------------------------------------------------------------------------
// Admin — users
// ---------------------------------------------------------------------------

/** @type {import('./contracts').AdminUser[]} */
export let ADMIN_USERS = [
  { id: 'u-maya-001',  name: 'Maya Reed',    email: 'maya@example.com',   role: 'seeker', status: 'active',    joined: '2025-11-01T00:00:00.000Z' },
  { id: 'u-ari-001',   name: 'Ari L.',       email: 'ari@example.com',    role: 'mentor', status: 'active',    joined: '2025-09-15T00:00:00.000Z' },
  { id: 'u-sam-002',   name: 'Coach Sam',    email: 'sam@example.com',    role: 'mentor', status: 'active',    joined: '2025-08-01T00:00:00.000Z' },
  { id: 'u-priya-003', name: 'Priya M.',     email: 'priya@example.com',  role: 'mentor', status: 'pending',   joined: '2026-03-20T00:00:00.000Z' },
  { id: 'u-jordan-04', name: 'Jordan K.',    email: 'jordan@example.com', role: 'seeker', status: 'suspended', joined: '2025-12-10T00:00:00.000Z' },
  { id: 'u-riley-005', name: 'Riley P.',     email: 'riley@example.com',  role: 'seeker', status: 'active',    joined: '2026-01-05T00:00:00.000Z' },
]
