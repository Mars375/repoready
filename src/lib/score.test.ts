import { describe, it, expect } from 'vitest'
import { calculateScore } from './score'

describe('calculateScore', () => {
  it('returns 100 for complete files', () => {
    const files = {
      readme: 'a'.repeat(201),
      envExample: 'DATABASE_URL=\nCLERK_KEY=',
      dockerCompose: 'services:\n  app:\n    image: node',
      ci: 'jobs:\n  build:\n    runs-on: ubuntu-latest',
    }
    expect(calculateScore(files)).toBe(100)
  })

  it('returns 0 for empty files', () => {
    expect(calculateScore({ readme: '', envExample: '', dockerCompose: '', ci: '' })).toBe(0)
  })
})
