import client from './client'

function toUiMentor(raw = {}) {
  const profile = raw.profile || {}
  const stats = raw.stats || {}
  const expertise = raw.expertise || {}
  const availability = raw.availability || {}
  const credentials = raw.credentials || {}

  return {
    id: raw.id,
    initials: raw.initials || (raw.displayName || raw.name || 'MB').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
    name: raw.displayName || raw.name || 'Unknown Mentor',
    avatar: profile.avatarUrl || raw.avatar || 'linear-gradient(135deg,#4facfe,#00f2fe)',
    role: raw.role || `Mentor${expertise.specialties?.length ? ` · ${expertise.specialties[0]}` : ''}`,
    yrs: credentials.yearsExperience || raw.yrs || 0,
    helped: stats.sessionsCompleted || raw.helped || 0,
    rating: stats.ratingAvg || raw.rating || 0,
    online: Boolean(availability.online ?? raw.online),
    topics: expertise.topics || raw.topics || [],
    style: expertise.styles || raw.style || [],
    stage: raw.stage || 'recovered',
    quote: profile.quote || raw.quote || '',
    bio: profile.bio || raw.bio || '',
    tags: raw.tags || [],
  }
}

function normalizeMatchItem(item = {}) {
  const mentorSource = item.mentor || item.candidate || item
  return {
    mentor: toUiMentor(mentorSource),
    score: Number(item.score ?? item.matchScore ?? 0),
    reasons: Array.isArray(item.reasons) ? item.reasons : Array.isArray(item.matchReasons) ? item.matchReasons : [],
    components: item.components || item.scoreBreakdown || {},
  }
}

export async function fetchMentorMatches(payload) {
  const { data } = await client.post('/api/mentors/match', payload)
  const root = data?.data || data
  const matches = Array.isArray(root?.matches)
    ? root.matches
    : Array.isArray(root?.results)
      ? root.results
      : []

  return {
    matches: matches.map(normalizeMatchItem),
    meta: root?.meta || null,
  }
}

export async function fetchMentorCatalog(params = {}) {
  const { data } = await client.get('/api/mentors', { params })
  return data
}
