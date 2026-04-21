const DEFAULT_WEIGHTS = {
  topics: 0.28,
  style: 0.16,
  stage: 0.1,
  availability: 0.16,
  quality: 0.3,
}

function clean(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
}

function overlapRatio(left = [], right = []) {
  const a = new Set(left.map(clean).filter(Boolean))
  const b = new Set(right.map(clean).filter(Boolean))
  if (!a.size || !b.size) return 0
  let common = 0
  for (const token of a) {
    if (b.has(token)) common += 1
  }
  const denom = Math.max(a.size, b.size)
  return denom ? common / denom : 0
}

function stageScore(seekerStage, mentorStage) {
  const key = `${clean(seekerStage)}|${clean(mentorStage)}`
  const matrix = {
    'early|recovered': 92,
    'early|mid-recovery': 88,
    'mid-recovery|recovered': 95,
    'mid-recovery|mid-recovery': 90,
    'maintenance|recovered': 85,
    'maintenance|mid-recovery': 80,
  }
  if (matrix[key]) return matrix[key]
  return clean(mentorStage) === 'recovered' ? 90 : 78
}

function clamp100(value) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function qualityScore(mentor) {
  const ratingScore = clamp100(((mentor.rating || 0) / 5) * 100)
  const expScore = clamp100(mentor.exp ?? ((mentor.yrs || 0) / 10) * 100)
  const activityScore = clamp100(mentor.activity ?? 70)
  return clamp100(ratingScore * 0.45 + expScore * 0.3 + activityScore * 0.25)
}

function availabilityScore(mentor) {
  return clamp100(mentor.avail ?? mentor.availabilityScore ?? 70)
}

export function scoreMentorMatch(seeker, mentor, customWeights = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights }
  const topics = clamp100(overlapRatio(seeker.topics, mentor.topics) * 100)
  const style = clamp100(overlapRatio(seeker.style, mentor.style) * 100)
  const stage = stageScore(seeker.stage, mentor.stage)
  const availability = availabilityScore(mentor)
  const quality = qualityScore(mentor)
  const safetyPenalty = clamp100((mentor.riskFlags || 0) * 10)

  const raw =
    topics * weights.topics +
    style * weights.style +
    stage * weights.stage +
    availability * weights.availability +
    quality * weights.quality -
    safetyPenalty

  const score = clamp100(raw)
  const reasons = []
  if (topics >= 60) reasons.push('Shared focus topics')
  if (style >= 60) reasons.push('Support style aligns')
  if (availability >= 75) reasons.push('Strong recent availability')
  if (quality >= 80) reasons.push('High quality outcomes')
  if (!reasons.length) reasons.push('Overall compatibility fit')

  return {
    mentor,
    score,
    reasons: reasons.slice(0, 3),
    components: {
      topics,
      style,
      stage,
      availability,
      quality,
      safetyPenalty,
    },
  }
}

export function rankMentorMatches(seeker, mentors = [], customWeights = {}) {
  return mentors
    .map((mentor) => scoreMentorMatch(seeker, mentor, customWeights))
    .sort((a, b) => b.score - a.score)
}
