import { describe, it, expect } from 'vitest'
import { parseGeneratedFiles } from './parse-files'

describe('parseGeneratedFiles', () => {
  it('parses all 4 sections from a stream output', () => {
    const text = [
      '---FILE:README.md---',
      '# My Project\nThis is a test readme with more than two hundred words ' + 'word '.repeat(40),
      '---FILE:.env.example---',
      'DATABASE_URL=\nCLERK_KEY=',
      '---FILE:docker-compose.yml---',
      'services:\n  app:\n    image: node',
      '---FILE:.github/workflows/ci.yml---',
      'jobs:\n  build:\n    runs-on: ubuntu-latest',
    ].join('\n')

    const result = parseGeneratedFiles(text)
    expect(result.readme).toContain('# My Project')
    expect(result.envExample).toContain('DATABASE_URL=')
    expect(result.dockerCompose).toContain('services:')
    expect(result.ci).toContain('jobs:')
  })

  it('returns empty strings for missing sections', () => {
    const result = parseGeneratedFiles('---FILE:README.md---\n# Only readme')
    expect(result.readme).toBe('# Only readme')
    expect(result.envExample).toBe('')
    expect(result.dockerCompose).toBe('')
    expect(result.ci).toBe('')
  })
})
