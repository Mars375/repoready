# RepoReady

Generate repo-specific setup docs and starter ops files from a public GitHub URL.

RepoReady analyzes a repository, streams generation output live, and produces four files: `README.md`, `.env.example`, `docker-compose.yml`, and `.github/workflows/ci.yml`. The current repo includes the landing page, analysis flow, download UI, history storage, score calculation, and tests for key parsing and scoring logic.

## Features

- GitHub URL analysis for public repositories
- Generated output for 4 files:
  - `README.md`
  - `.env.example`
  - `docker-compose.yml`
  - `.github/workflows/ci.yml`
- Live streaming analysis UI during generation
- ZIP download for generated files
- Analysis history for signed-in users
- Readiness scoring for generated output
- Anonymous rate limiting with higher access for authenticated users
- GitHub file fetching and stack detection
- Tests for parsing, scoring, GitHub helpers, rate limiting, and the analyze route

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **AI:** Vercel AI SDK
- **GitHub integration:** Octokit REST
- **Auth:** Clerk
- **Database:** Neon Postgres + Drizzle ORM
- **UI:** Tailwind CSS v4, Base UI, shadcn/ui
- **Syntax highlighting:** Shiki
- **Archive generation:** JSZip
- **Testing:** Vitest

## Local Setup

```bash
git clone https://github.com/Mars375/repoready.git
cd repoready
npm install
```

**Note:** the current repo does not include a committed `.env.example`, so create `.env.local` manually.

At minimum, the codebase directly references:

```env
DATABASE_URL=
GITHUB_TOKEN=
```

The current codebase and docs also indicate Clerk-based authentication and AI-backed generation, so local setup should include the Clerk values used by the app and any AI/runtime configuration required by your environment.

Then start the app:

```bash
npm run dev
```

If you want database-backed history, push the schema first:

```bash
npx drizzle-kit push
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes on Testing

Vitest test files are present in the repository, but the current `package.json` does not expose a `test` script. If you want to run the existing tests, invoke Vitest directly in your own workflow.

## Project Status

**Current status: early but functional MVP.**

The core product flow exists: URL input, repo fetching, streamed generation, scoring, downloads, and saved history. Two gaps are visible in the current repo state: there is no committed `.env.example`, and `package.json` does not yet define a `test` script even though tests exist in `src/`.
