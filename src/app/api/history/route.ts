import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { analyses } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await db
    .select()
    .from(analyses)
    .where(eq(analyses.userId, userId))
    .orderBy(desc(analyses.createdAt))
    .limit(20)

  return Response.json(data)
}
