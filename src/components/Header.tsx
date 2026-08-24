import { Braces, CircleDot, History } from 'lucide-react'
import type { ConnectionStatus } from '../types/copy'

interface HeaderProps {
  status: ConnectionStatus
  historyCount: number
  onOpenHistory: () => void
}

const statusCopy: Record<ConnectionStatus, string> = {
  idle: 'IA aguardando',
  connected: 'Gemini conectado',
  unavailable: 'IA indisponível',
}

export function Header({ status, historyCount, onOpenHistory }: HeaderProps) {
  return (
    <header className="border-b border-[#1E2B3D] bg-[#080D16]/95">
      <div className="mx-auto flex min-h-20 max-w-[1080px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
            <Braces aria-hidden="true" size={20} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight text-slate-50">CopyForge</p>
            <p className="hidden truncate text-xs text-slate-400 min-[390px]:block">
              Motor inteligente de copy para ofertas
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium sm:flex ${
              status === 'connected'
                ? 'border-emerald-400/25 bg-emerald-400/8 text-emerald-300'
                : status === 'unavailable'
                  ? 'border-amber-400/25 bg-amber-400/8 text-amber-200'
                  : 'border-[#26364b] bg-[#0D1422] text-slate-400'
            }`}
            role="status"
          >
            <CircleDot aria-hidden="true" size={14} />
            {statusCopy[status]}
          </div>
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-[#26364b] bg-[#0D1422] px-3 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            aria-label={`Abrir histórico com ${historyCount} gerações`}
          >
            <History aria-hidden="true" size={17} />
            <span className="hidden sm:inline">Histórico</span>
            {historyCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-cyan-400/12 px-1.5 text-[11px] text-cyan-300">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
