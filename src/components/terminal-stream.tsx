'use client'
import { useEffect, useRef } from 'react'

interface Props {
  text: string
  isStreaming: boolean
}

export function TerminalStream({ text, isStreaming }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [text])

  const lines = text.split('\n')

  return (
    <div
      ref={ref}
      className="bg-[#080706] font-mono text-sm p-4 h-80 overflow-y-auto border border-stone-900"
      role="log"
      aria-label="Analysis output"
      aria-live="polite"
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.startsWith('---FILE:')
              ? 'text-amber-500 mt-3 font-bold'
              : line.startsWith('✓') || line.startsWith('→')
              ? 'text-stone-400'
              : 'text-stone-300'
          }
        >
          {line || '\u00A0'}
        </div>
      ))}
      {isStreaming && (
        <span className="text-amber-500 motion-safe:animate-pulse" aria-hidden="true">
          ▊
        </span>
      )}
    </div>
  )
}
