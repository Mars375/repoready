import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

// Mock db to avoid requiring DATABASE_URL in test env
vi.mock('@/lib/db', () => ({
  db: { insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }) },
}))

// Mock fetchRepoFiles
vi.mock('@/lib/github', () => ({
  fetchRepoFiles: vi.fn().mockResolvedValue({
    repoName: 'test-repo',
    owner: 'testuser',
    detectedStack: ['Next.js', 'TypeScript'],
    keyFilesContent: '--- FILE: package.json ---\n{"name":"test"}',
  }),
}))

describe('POST /api/analyze', () => {
  it('rejects invalid URLs', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ url: 'not-a-github-url' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 429 when rate limit exceeded', async () => {
    const exhaustedCookie = JSON.stringify({ count: 3, date: new Date().toDateString() })
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://github.com/test/repo' }),
      headers: { cookie: `ratelimit=${exhaustedCookie}` },
    })
    const res = await POST(req)
    expect(res.status).toBe(429)
  })
})
