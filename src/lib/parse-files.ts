export interface GeneratedFiles {
  readme: string
  envExample: string
  dockerCompose: string
  ci: string
}

export function parseGeneratedFiles(text: string): GeneratedFiles {
  const sections = text.split(/---FILE:(.+?)---/)
  const files: GeneratedFiles = { readme: '', envExample: '', dockerCompose: '', ci: '' }
  for (let i = 1; i < sections.length; i += 2) {
    const name = sections[i].trim()
    const content = sections[i + 1]?.trim() ?? ''
    if (name === 'README.md') files.readme = content
    if (name === '.env.example') files.envExample = content
    if (name === 'docker-compose.yml') files.dockerCompose = content
    if (name.includes('ci.yml')) files.ci = content
  }
  return files
}
