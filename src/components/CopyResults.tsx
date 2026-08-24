import { RefreshCw } from 'lucide-react'
import type { CopyRequest, CopyResponse } from '../types/copy'
import { formatNarrationDurationOption } from '../utils/narration'
import { CopyCard } from './CopyCard'

interface CopyResultsProps {
  result: CopyResponse
  request: CopyRequest
  isLoading: boolean
  error: string | null
  onRegenerate: (request: CopyRequest) => Promise<void>
}

export function CopyResults({ result, request, isLoading, error, onRegenerate }: CopyResultsProps) {
  return (
    <section id="copy-results" aria-labelledby="results-title" className="scroll-mt-6 space-y-4">
      <div className="flex flex-col justify-between gap-3 border-b border-[#1E2B3D] pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">Resultado</p>
          <h2 id="results-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-50">
            Copies geradas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {result.copies.length} {result.copies.length === 1 ? 'versão' : 'versões'} para {request.productName}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Faixa solicitada: {formatNarrationDurationOption(request.narrationDuration)}
          </p>
        </div>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onRegenerate(request)}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-[9px] border border-[#2a3b52] bg-[#111B2D] px-4 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw aria-hidden="true" className={isLoading ? 'animate-spin' : ''} size={16} />
          {isLoading ? 'Gerando...' : 'Gerar novamente'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-[10px] border border-red-400/20 bg-red-400/7 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      <div className="space-y-3">
        {result.copies.map((copy, index) => (
          <CopyCard key={`${copy.id}-${index}`} copy={copy} index={index} />
        ))}
      </div>
    </section>
  )
}
