import { describe, it, expect } from 'vitest'
import { fetchRepoFiles } from './github'

describe('fetchRepoFiles', () => {
  it('returns key files from a public repo', async () => {
    const result = await fetchRepoFiles('https://github.com/vercel/next.js')
    expect(result.repoName).toBe('next.js')
    expect(result.detectedStack).toBeInstanceOf(Array)
    expect(typeof result.keyFilesContent).toBe('string')
    expect(result.keyFilesContent.length).toBeGreaterThan(0)
  }, 30_000)

  it('throws on invalid URL', async () => {
    await expect(fetchRepoFiles('not-a-url')).rejects.toThrow('Invalid GitHub URL')
  })
})
