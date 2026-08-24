import { LoaderCircle, Sparkles } from 'lucide-react'

interface GenerateButtonProps {
  isLoading: boolean
}

export function GenerateButton({ isLoading }: GenerateButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-bold text-[#06101a] shadow-[0_10px_30px_rgba(34,211,238,0.10)] transition duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-wait disabled:opacity-70 disabled:hover:brightness-100"
    >
      {isLoading ? (
        <>
          <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
          Criando suas copies...
        </>
      ) : (
        <>
          <Sparkles aria-hidden="true" size={18} />
          Gerar copies
        </>
      )}
    </button>
  )
}
