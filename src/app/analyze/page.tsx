'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import { TerminalStream } from '@/components/terminal-stream'
import { AnalysisSummary } from '@/components/analysis-summary'
import { parseGeneratedFiles } from '@/lib/parse-files'
import { calculateScore } from '@/lib/score'

function AnalyzePage() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url') ?? ''
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')
  const started = useRef(false)

  useEffect(() => {
    if (!url || started.current) return
    started.current = true

    async function run() {
      setIsStreaming(true)
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })

        if (!res.ok) {
          const err = await res.json()
          setError(err.error ?? 'Analysis failed')
          return
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setText(prev => prev + decoder.decode(value, { stream: true }))
        }
      } catch {
        setError('Network error — please try again')
      } finally {
        setIsStreaming(false)
      }
    }

    run()
  }, [url])

  const files = parseGeneratedFiles(text)
  const score = calculateScore(files)
  const done = !isStreaming && text.length > 0

  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-100 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Status bar */}
        <div className="mb-6 flex items-center gap-3">
          <a
            href="/"
            className="text-sm font-mono text-stone-600 hover:text-stone-400 transition-colors duration-200 cursor-pointer"
          >
            ← back
          </a>
          <span className="text-stone-800">|</span>
          <p className="font-mono text-xs text-stone-500">
            {isStreaming
              ? '⟳ Analyzing...'
              : done
              ? '✓ Analysis complete'
              : error
              ? `✗ ${error}`
              : 'Starting...'}
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Terminal stream */}
          <div>
            <p className="font-mono text-xs text-stone-600 uppercase tracking-widest mb-2">
              Output
            </p>
            <TerminalStream text={text || (isStreaming ? '' : 'Waiting...')} isStreaming={isStreaming} />
          </div>

          {/* Summary panel — shows when done */}
          {done && (
            <AnalysisSummary
              files={files}
              score={score}
              repoName={url.split('/').slice(-1)[0] ?? url}
              stack={[]}
            />
          )}
        </div>
      </div>
    </main>
  )
}

// useSearchParams requires Suspense boundary
export default function AnalyzePageWrapper() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0c0a09] text-stone-100 p-8 flex items-center justify-center">
        <p className="font-mono text-stone-500">Loading...</p>
      </main>
    }>
      <AnalyzePage />
    </Suspense>
  )
}
