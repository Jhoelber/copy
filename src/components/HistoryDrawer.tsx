import { Clock3, FileText, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { HistoryEntry } from '../types/copy'
import { formatNarrationDurationOption } from '../utils/narration'

interface HistoryDrawerProps {
  open: boolean
  history: HistoryEntry[]
  onClose: () => void
  onSelect: (entry: HistoryEntry) => void
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function HistoryDrawer({ open, history, onClose, onSelect }: HistoryDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="history-title">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/65"
        onClick={onClose}
        aria-label="Fechar histórico"
      />
      <aside ref={drawerRef} className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-[#26364b] bg-[#0D1422] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E2B3D] px-5 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300/80">Local</p>
            <h2 id="history-title" className="mt-1 text-lg font-semibold text-slate-50">
              Histórico de gerações
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-[9px] border border-[#26364b] text-slate-400 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            aria-label="Fechar histórico"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <Clock3 aria-hidden="true" className="mx-auto text-slate-600" size={30} strokeWidth={1.5} />
                <p className="mt-4 text-sm font-medium text-slate-300">Nenhuma geração salva</p>
                <p className="mt-1 max-w-64 text-xs leading-5 text-slate-500">
                  Suas últimas 10 gerações aparecerão aqui e ficarão apenas neste navegador.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(entry)
                      onClose()
                    }}
                    className="w-full rounded-[10px] border border-[#1E2B3D] bg-[#111B2D] p-4 text-left transition hover:border-[#34465f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[8px] bg-cyan-400/8 text-cyan-300">
                        <FileText aria-hidden="true" size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-100">
                          {entry.request.productName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {entry.request.copyType} · {entry.response.copies.length}{' '}
                          {entry.response.copies.length === 1 ? 'copy' : 'copies'}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-slate-600">
                          {formatNarrationDurationOption(entry.request.narrationDuration)}
                        </p>
                        <time dateTime={entry.createdAt} className="mt-2 block text-[11px] text-slate-600">
                          {dateFormatter.format(new Date(entry.createdAt))}
                        </time>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="border-t border-[#1E2B3D] px-5 py-4 text-xs leading-5 text-slate-600">
          Os dados não são sincronizados e podem ser removidos ao limpar o armazenamento do navegador.
        </p>
      </aside>
    </div>
  )
}
