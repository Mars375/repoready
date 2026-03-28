# RepoReady

> Paste a GitHub URL — get a production-ready README, `.env.example`, `docker-compose.yml`, and CI workflow in seconds.

RepoReady analyzes your repository's actual code, detects the stack, and uses Claude to generate documentation that reflects what's really in the repo — not a generic template.

## Features

- **AI doc generation** — README, `.env.example`, `docker-compose.yml`, `.github/workflows/ci.yml`
- **Stack detection** — automatically identifies frameworks, databases, auth providers
- **Live terminal stream** — watch the output generate in real time
- **Analysis history** — authenticated users get a full history of past analyses
- **Readiness score** — rates how production-ready the generated docs are
- **One-click download** — export all 4 files as a ZIP
- **Rate limiting** — anonymous users get a usage cap; sign in for unlimited access
- **Auth** — Clerk (email, OAuth)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| AI | Vercel AI SDK v6 + AI Gateway (`anthropic/claude-sonnet-4.6`) |
| GitHub | Octokit REST |
| Auth | Clerk |
| Database | Neon Postgres + Drizzle ORM |
| UI | shadcn/ui, Tailwind CSS v4, Base UI |
| Syntax highlighting | Shiki |
| Archive | JSZip |
| Tests | Vitest |

## Getting Started

```bash
git clone https://github.com/your-username/repoready.git
cd repoready
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Neon
DATABASE_URL=

# AI Gateway (via Vercel)
# Run: vercel link && vercel env pull
# VERCEL_OIDC_TOKEN is auto-provisioned — no Anthropic key needed
```

Push the schema and start dev:

```bash
npx drizzle-kit push
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── analyze/             # Repo URL input + live terminal stream
│   ├── dashboard/           # Analysis history (authenticated)
│   └── api/
│       ├── analyze/         # POST — fetch repo, stream AI generation, save result
│       └── history/         # GET — user's past analyses
├── components/
│   ├── terminal-stream.tsx  # Live streaming output display
│   ├── analysis-summary.tsx # Readiness score + file tabs
│   ├── download-button.tsx  # ZIP export
│   ├── url-input.tsx        # Repo URL form
│   └── history-list.tsx     # Past analyses
└── lib/
    ├── github.ts            # Fetch repo files via Octokit
    ├── parse-files.ts       # Parse AI output into individual files
    ├── score.ts             # Readiness score calculation
    ├── rate-limit.ts        # Cookie-based rate limiting for anonymous users
    └── db/
        ├── schema.ts        # Drizzle schema (analyses table)
        └── index.ts         # Neon connection
```

## Tests

```bash
npm run test
```

Tests cover the core logic: GitHub fetching, file parsing, score calculation, and rate limiting.
