import { streamText, gateway } from 'ai'
import { cookies } from 'next/headers'
import { fetchRepoFiles } from '@/lib/github'
import { checkRateLimit, incrementRateLimit } from '@/lib/rate-limit'
import { calculateScore } from '@/lib/score'
import { parseGeneratedFiles } from '@/lib/parse-files'
import { db } from '@/lib/db'
import { analyses } from '@/lib/db/schema'

function parseCookieHeader(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

async function getAuthUserId(): Promise<string | null> {
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    return userId
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const { url } = await req.json()

  if (!url?.includes('github.com')) {
    return Response.json({ error: 'Invalid GitHub URL' }, { status: 400 })
  }

  // Auth check
  const userId = await getAuthUserId()

  // Rate limit for anonymous users — read cookie from request headers
  if (!userId) {
    const rawCookie = req.headers.get('cookie')
    const rlCookie = parseCookieHeader(rawCookie, 'ratelimit')
    if (!checkRateLimit(rlCookie)) {
      return Response.json({ error: 'Rate limit exceeded. Sign in for unlimited access.' }, { status: 429 })
    }
  }

  let repoData
  try {
    repoData = await fetchRepoFiles(url)
  } catch {
    return Response.json({ error: 'Could not fetch repo. Check the URL or make it public.' }, { status: 400 })
  }

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: `You are an expert developer documentation writer.
Generate exactly 4 files separated by ---FILE:filename--- markers.
Base everything on the ACTUAL code provided. Never use generic templates.
Always use real values found in the code.`,
    prompt: `Repository: ${repoData.owner}/${repoData.repoName}
Detected stack: ${repoData.detectedStack.join(', ')}
Key files:
${repoData.keyFilesContent}

Generate these 4 files in order, each preceded by its marker:
---FILE:README.md---
---FILE:.env.example---
---FILE:docker-compose.yml---
---FILE:.github/workflows/ci.yml---`,
    maxOutputTokens: 4000,
    onFinish: async ({ text }) => {
      const files = parseGeneratedFiles(text)
      const score = calculateScore(files)

      // Save for authenticated users
      if (userId) {
        await db.insert(analyses).values({
          userId,
          repoUrl: url,
          repoName: repoData.repoName,
          stack: repoData.detectedStack,
          files,
          score,
        })
      }

      // Update rate limit cookie for anonymous users
      if (!userId) {
        try {
          const cookieStore = await cookies()
          const rlCookie = cookieStore.get('ratelimit')?.value
          const updated = incrementRateLimit(rlCookie)
          cookieStore.set('ratelimit', updated, { httpOnly: true, maxAge: 60 * 60 * 24 })
        } catch {
          // Cookie update not available outside Next.js context
        }
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
