interface GeneratedFiles {
  readme: string
  envExample: string
  dockerCompose: string
  ci: string
}

export function calculateScore(files: GeneratedFiles): number {
  let score = 0
  if (files.readme.length > 200) score += 25
  if (files.envExample.includes('=')) score += 25
  if (files.dockerCompose.includes('services:')) score += 25
  if (files.ci.includes('jobs:')) score += 25
  return score
}
