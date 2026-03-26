import { pgTable, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const analyses = pgTable('analyses', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    text('user_id').notNull(),
  repoUrl:   text('repo_url').notNull(),
  repoName:  text('repo_name').notNull(),
  stack:     text('stack').array(),
  files:     jsonb('files').$type<{
    readme: string
    envExample: string
    dockerCompose: string
    ci: string
  }>().notNull(),
  score:     integer('score').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type Analysis = typeof analyses.$inferSelect
export type NewAnalysis = typeof analyses.$inferInsert
