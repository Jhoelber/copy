import { FlaskConical } from 'lucide-react'

export function Tabs() {
  return (
    <nav aria-label="Laboratórios" className="border-b border-[#1E2B3D] bg-[#0A101B]">
      <div className="mx-auto flex max-w-[1080px] items-center gap-6 px-4 sm:px-6">
        <button
          type="button"
          aria-current="page"
          className="relative min-h-13 border-b-2 border-cyan-400 px-0.5 text-sm font-semibold text-slate-50"
        >
          Copy Geral
        </button>
        <button
          type="button"
          disabled
          title="Creative Ads Lab estará disponível em breve"
          className="flex min-h-13 cursor-not-allowed items-center gap-2 px-0.5 text-sm font-medium text-slate-500"
        >
          <FlaskConical aria-hidden="true" size={15} />
          Creative Ads Lab
          <span className="rounded-full border border-[#26364b] px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">
            Em breve
          </span>
        </button>
      </div>
    </nav>
  )
}
