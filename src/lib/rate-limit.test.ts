import { describe, it, expect } from 'vitest'
import { checkRateLimit, incrementRateLimit } from './rate-limit'

describe('rate limit', () => {
  it('allows first 3 requests', () => {
    const cookie = JSON.stringify({ count: 2, date: new Date().toDateString() })
    expect(checkRateLimit(cookie)).toBe(true)
  })

  it('blocks 4th request same day', () => {
    const cookie = JSON.stringify({ count: 3, date: new Date().toDateString() })
    expect(checkRateLimit(cookie)).toBe(false)
  })

  it('resets on new day', () => {
    const cookie = JSON.stringify({ count: 3, date: 'Mon Jan 01 2024' })
    expect(checkRateLimit(cookie)).toBe(true)
  })
})
