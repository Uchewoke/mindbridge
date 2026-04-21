import { describe, expect, it } from 'vitest'
import { rankMentorMatches, scoreMentorMatch } from './mentorMatcher'

const seeker = {
  topics: ['Social Media', 'Anxiety'],
  style: ['Reflective', 'Gentle accountability'],
  stage: 'mid-recovery',
}

describe('scoreMentorMatch', () => {
  it('returns bounded score and components', () => {
    const mentor = {
      id: 'm1',
      topics: ['Social Media', 'Anxiety'],
      style: ['Reflective'],
      stage: 'recovered',
      avail: 90,
      rating: 4.8,
      exp: 88,
      activity: 85,
      riskFlags: 0,
    }

    const result = scoreMentorMatch(seeker, mentor)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.components.topics).toBeGreaterThan(0)
    expect(result.components.style).toBeGreaterThan(0)
    expect(result.reasons.length).toBeGreaterThan(0)
  })

  it('applies safety penalty for risk flags', () => {
    const safeMentor = {
      id: 'safe',
      topics: ['Social Media'],
      style: ['Reflective'],
      stage: 'recovered',
      avail: 85,
      rating: 4.8,
      exp: 80,
      activity: 80,
      riskFlags: 0,
    }

    const flaggedMentor = {
      ...safeMentor,
      id: 'flagged',
      riskFlags: 2,
    }

    const safe = scoreMentorMatch(seeker, safeMentor)
    const flagged = scoreMentorMatch(seeker, flaggedMentor)
    expect(flagged.score).toBeLessThan(safe.score)
    expect(flagged.components.safetyPenalty).toBe(20)
  })

  it('respects custom weight overrides', () => {
    const mentor = {
      id: 'm2',
      topics: ['Anxiety'],
      style: ['Direct'],
      stage: 'mid-recovery',
      avail: 60,
      rating: 4.0,
      exp: 60,
      activity: 60,
    }

    const base = scoreMentorMatch(seeker, mentor)
    const weighted = scoreMentorMatch(seeker, mentor, {
      topics: 0.6,
      style: 0.05,
      stage: 0.1,
      availability: 0.1,
      quality: 0.15,
    })

    expect(weighted.score).not.toBe(base.score)
  })
})

describe('rankMentorMatches', () => {
  it('sorts mentors by descending score', () => {
    const mentors = [
      {
        id: 'low',
        topics: ['Gaming'],
        style: ['Direct'],
        stage: 'mid-recovery',
        avail: 40,
        rating: 3.2,
        exp: 40,
        activity: 40,
      },
      {
        id: 'high',
        topics: ['Social Media', 'Anxiety'],
        style: ['Reflective'],
        stage: 'recovered',
        avail: 90,
        rating: 4.9,
        exp: 95,
        activity: 88,
      },
    ]

    const ranked = rankMentorMatches(seeker, mentors)
    expect(ranked).toHaveLength(2)
    expect(ranked[0].mentor.id).toBe('high')
    expect(ranked[1].mentor.id).toBe('low')
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score)
  })
})
