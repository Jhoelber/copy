interface IntensitySliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

function getIntensityLabel(value: number) {
  if (value <= 30) return 'Suave'
  if (value <= 70) return 'Direto'
  return 'Agressivo'
}

export function IntensitySlider({ value, onChange, disabled }: IntensitySliderProps) {
  const label = getIntensityLabel(value)

  return (
    <div className="rounded-[12px] border border-[#1E2B3D] bg-[#0D1422] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <label htmlFor="intensity" className="text-sm font-semibold text-slate-200">
            Intensidade
          </label>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Ajusta energia, urgência e pressão comercial — nunca a veracidade.
          </p>
        </div>
        <output
          htmlFor="intensity"
          className="rounded-md border border-cyan-400/20 bg-cyan-400/8 px-2.5 py-1 text-xs font-semibold text-cyan-300"
        >
          {value} · {label}
        </output>
      </div>
      <input
        id="intensity"
        type="range"
        min="0"
        max="100"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--range-progress': `${value}%` } as React.CSSProperties}
        className="intensity-range w-full"
      />
      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500" aria-hidden="true">
        <span>Suave</span>
        <span>Direto</span>
        <span>Agressivo</span>
      </div>
    </div>
  )
}
