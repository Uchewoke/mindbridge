import { mockEmbedding } from './embeddings.js'
import { scoreMentorMatch } from './scoring.engine.js'

export function rankMentors(
  seekerProfile: string,
  mentors: Array<{ id: string; profile: string }>,
) {
  const seekerVector = mockEmbedding(seekerProfile)
  return mentors
    .map((mentor) => ({
      mentorId: mentor.id,
      score: scoreMentorMatch(seekerVector, mockEmbedding(mentor.profile)),
    }))
    .sort((a, b) => b.score - a.score)
}
