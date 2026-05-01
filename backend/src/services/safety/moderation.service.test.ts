import { describe, expect, it } from 'vitest'
import { moderateMessage } from './moderation.service.js'

describe('moderateMessage', () => {
  it('blocks exact banned words', () => {
    const result = moderateMessage('I promote violence and hate.', {
      bannedWords: ['hate', 'violence'],
    })

    expect(result.approved).toBe(false)
    expect(result.reasons).toEqual([
      'Contains banned language: hate',
      'Contains banned language: violence',
    ])
  })

  it('does not block substring matches inside other words', () => {
    const result = moderateMessage('Whatever happens, we choose compassion.', {
      bannedWords: ['hate'],
    })

    expect(result.approved).toBe(true)
    expect(result.reasons).toEqual([])
  })

  it('supports multi-word banned phrases', () => {
    const result = moderateMessage('This message encourages hate speech.', {
      bannedWords: ['hate speech'],
    })

    expect(result.approved).toBe(false)
    expect(result.reasons).toEqual(['Contains banned language: hate speech'])
  })
})
