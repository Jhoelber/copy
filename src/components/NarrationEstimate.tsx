import { Info } from 'lucide-react'
import { useState } from 'react'
import type { NarrationDuration } from '../../shared/narrationConfig'
import { formatNarrationDurationOption } from '../utils/narration'

interface NarrationEstimateProps {
  duration: NarrationDuration
}

export function NarrationEstimate({ duration }: NarrationEstimateProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
      <span>{formatNarrationDurationOption(duration)}</span>
      <span className="group relative mt-0.5 shrink-0">
        <button
          type="button"
          aria-label="Como a duração da narração é estimada"
          aria-expanded={open}
          aria-describedby="narration-estimate-tooltip"
          onClick={() => setOpen((current) => !current)}
          onBlur={() => setOpen(false)}
          className="grid size-5 place-items-center rounded-full text-slate-500 transition hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-400"
        >
          <Info aria-hidden="true" size={14} />
        </button>
        <span
          id="narration-estimate-tooltip"
          role="tooltip"
          className={`fixed inset-x-4 bottom-4 z-20 w-auto rounded-[9px] border border-[#34465f] bg-[#0A111E] p-3 text-xs font-normal leading-5 text-slate-300 shadow-xl transition sm:absolute sm:inset-x-auto sm:bottom-7 sm:left-1/2 sm:w-64 sm:-translate-x-1/2 ${
            open
              ? 'visible opacity-100'
              : 'invisible opacity-0 group-hover:visible group-hover:opacity-100'
          }`}
        >
          Estimativa baseada em faixas calibradas de caracteres para narrações entre 1 e 60 minutos.
          A duração real pode variar conforme ritmo, pausas e interpretação.
        </span>
      </span>
    </div>
  )
}
