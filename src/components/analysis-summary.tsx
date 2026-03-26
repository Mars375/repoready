import { DownloadButton } from './download-button'
import type { GeneratedFiles } from '@/lib/parse-files'

interface Props {
  files: GeneratedFiles
  score: number
  repoName: string
  stack: string[]
}

export function AnalysisSummary({ files, score, repoName, stack }: Props) {
  // SVG arc score: semicircle path length ~126
  const arcLength = 126
  const filled = (score / 100) * arcLength

  return (
    <aside className="bg-[#1c1917] border border-[#292524] p-5 space-y-5 h-fit">
      {/* Repo info */}
      <div>
        <p className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">
          Repository
        </p>
        <p className="font-semibold text-stone-100 break-all">{repoName}</p>
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {stack.map(s => (
              <span
                key={s}
                className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Score arc */}
      <div className="flex flex-col items-center py-2" aria-label={`Quality score: ${score} out of 100`}>
        <svg viewBox="0 0 100 60" className="w-32" aria-hidden="true">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="#292524"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${arcLength}`}
          />
        </svg>
        <p className="text-2xl font-bold text-amber-500 -mt-2 tabular-nums">{score}</p>
        <p className="text-xs text-stone-500">quality score</p>
      </div>

      {/* File stats */}
      <div className="space-y-1.5 text-sm text-stone-400 font-mono">
        <p>{files.readme ? '✓' : '✗'} README.md — {files.readme.split('\n').length} lines</p>
        <p>
          {files.envExample ? '✓' : '✗'} .env.example —{' '}
          {files.envExample.split('\n').filter(l => l.includes('=')).length} vars
        </p>
        <p>{files.dockerCompose ? '✓' : '✗'} docker-compose.yml</p>
        <p>{files.ci ? '✓' : '✗'} .github/workflows/ci.yml</p>
      </div>

      <DownloadButton files={files} />
    </aside>
  )
}
