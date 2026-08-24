import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { GeneratedCopy } from '../types/copy'

interface CopyCardProps {
  copy: GeneratedCopy
  index: number
}

export function CopyCard({ copy, index }: CopyCardProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (copyStatus === 'idle') return
    const timeout = window.setTimeout(() => setCopyStatus('idle'), 1800)
    return () => window.clearTimeout(timeout)
  }, [copyStatus])

  async function handleCopy() {
    const text = [copy.headline, copy.body, copy.cta].filter(Boolean).join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <article className="rounded-[13px] border border-[#1E2B3D] bg-[#0D1625] p-4 transition hover:border-[#2a3b52] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Copy {String(index + 1).padStart(2, '0')}
          </span>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/8 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
            {copy.angle}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-[8px] border border-[#26364b] bg-[#111B2D] px-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          aria-label={`Copiar copy ${index + 1}`}
        >
          {copyStatus === 'copied' ? (
            <Check aria-hidden="true" size={14} />
          ) : (
            <Copy aria-hidden="true" size={14} />
          )}
          {copyStatus === 'copied' ? 'Copiado' : copyStatus === 'error' ? 'Falhou' : 'Copiar'}
        </button>
      </div>
      {copy.headline && (
        <h3 className="max-w-3xl text-lg font-semibold leading-snug text-slate-50 sm:text-xl">
          {copy.headline}
        </h3>
      )}
      <p className={`${copy.headline ? 'mt-3' : ''} whitespace-pre-wrap text-sm leading-7 text-slate-300`}>
        {copy.body}
      </p>
      {copy.cta && (
        <div className="mt-5 border-l-2 border-cyan-400/60 pl-3 text-sm font-semibold text-cyan-200">
          {copy.cta}
        </div>
      )}
    </article>
  )
}
