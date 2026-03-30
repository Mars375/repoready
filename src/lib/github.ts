import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export interface RepoData {
  repoName: string
  owner: string
  detectedStack: string[]
  keyFilesContent: string
}

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error('Invalid GitHub URL')
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

function detectStack(packageJson: string): string[] {
  try {
    const pkg = JSON.parse(packageJson)
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    const stack: string[] = []
    // Frameworks
    if (deps['next']) stack.push('Next.js')
    if (deps['react']) stack.push('React')
    if (deps['vue']) stack.push('Vue')
    if (deps['svelte'] || deps['@sveltejs/kit']) stack.push('Svelte')
    if (deps['express']) stack.push('Express')
    if (deps['fastify']) stack.push('Fastify')
    if (deps['hono']) stack.push('Hono')
    // Language
    if (deps['typescript'] || deps['@types/node']) stack.push('TypeScript')
    // Styling
    if (deps['tailwindcss']) stack.push('Tailwind CSS')
    // ORM / DB
    if (deps['drizzle-orm']) stack.push('Drizzle')
    if (deps['prisma'] || deps['@prisma/client']) stack.push('Prisma')
    if (deps['@neondatabase/serverless']) stack.push('Neon')
    if (deps['@supabase/supabase-js']) stack.push('Supabase')
    // Auth / Payments / API
    if (deps['@clerk/nextjs'] || deps['@clerk/clerk-sdk-node']) stack.push('Clerk')
    if (deps['next-auth']) stack.push('NextAuth')
    if (deps['stripe']) stack.push('Stripe')
    if (deps['@trpc/server']) stack.push('tRPC')
    // Infrastructure
    if (deps['docker-compose']) stack.push('Docker')
    return stack
  } catch {
    return []
  }
}

export async function fetchRepoFiles(url: string): Promise<RepoData> {
  const { owner, repo } = parseGitHubUrl(url)

  const TARGET_FILES = [
    'package.json',
    'package-lock.json',
    'docker-compose.yml',
    'docker-compose.yaml',
    '.env.example',
    'README.md',
  ]
  const collected: string[] = []
  let totalBytes = 0
  const MAX_BYTES = 100_000

  // Fetch root tree
  const { data: tree } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: 'HEAD',
    recursive: '1',
  })

  const targetPaths = tree.tree
    .filter(
      (f) =>
        f.type === 'blob' &&
        f.path &&
        TARGET_FILES.some((t) => f.path!.endsWith(t))
    )
    .slice(0, 50)

  for (const file of targetPaths) {
    if (totalBytes >= MAX_BYTES) break
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path!,
      })
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf8')
        collected.push(`\n--- FILE: ${file.path} ---\n${content}`)
        totalBytes += content.length
      }
    } catch {
      /* skip unreadable files */
    }
  }

  // Extract raw package.json content (strip the --- FILE: ... --- prefix)
  const packageJsonEntry = collected.find((c) => c.includes('package.json')) ?? ''
  const rawPackageJson = packageJsonEntry.replace(/^[\s\S]*?---\n/, '')
  const detectedStack = detectStack(rawPackageJson)

  return {
    repoName: repo,
    owner,
    detectedStack,
    keyFilesContent: collected.join('\n').slice(0, MAX_BYTES),
  }
}
