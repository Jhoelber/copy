import { useState, type FormEvent } from 'react'
import { COPY_TYPES, NARRATION_DURATIONS, VARIATION_OPTIONS } from '../../shared/copySchemas'
import {
  MAX_GENERATED_CHARACTERS_PER_REQUEST,
  NARRATION_DURATION_CONFIG,
  type NarrationDuration,
} from '../../shared/narrationConfig'
import type { CopyRequest, FieldErrors } from '../types/copy'
import { formatNarrationDurationOption } from '../utils/narration'
import { GenerateButton } from './GenerateButton'
import { IntensitySlider } from './IntensitySlider'
import { NarrationEstimate } from './NarrationEstimate'

const initialForm: CopyRequest = {
  productName: '',
  offer: '',
  audience: '',
  differentiators: '',
  copyType: 'Meta Ads',
  narrationDuration: '2',
  variations: 5,
  intensity: 55,
}

interface OfferFormProps {
  isLoading: boolean
  error: string | null
  onGenerate: (request: CopyRequest) => Promise<void>
}

function validateForm(form: CopyRequest): FieldErrors {
  const errors: FieldErrors = {}
  if (form.productName.trim().length < 2) errors.productName = 'Informe o nome do produto.'
  if (form.audience.trim().length < 10) {
    errors.audience = 'Descreva o público-alvo com pelo menos 10 caracteres.'
  }
  return errors
}

function getAllowedVariations(duration: NarrationDuration) {
  const maximumCharacters = NARRATION_DURATION_CONFIG[duration].maximumCharacters
  return VARIATION_OPTIONS.filter(
    (variations) => variations * maximumCharacters <= MAX_GENERATED_CHARACTERS_PER_REQUEST,
  )
}

export function OfferForm({ isLoading, error, onGenerate }: OfferFormProps) {
  const [form, setForm] = useState<CopyRequest>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})

  function updateField<K extends keyof CopyRequest>(field: K, value: CopyRequest[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'productName' || field === 'audience') {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  function updateCopyType(copyType: CopyRequest['copyType']) {
    setForm((current) => {
      const currentDuration = NARRATION_DURATION_CONFIG[current.narrationDuration]
      const narrationDuration =
        copyType === 'VSL' && currentDuration.maximumCharacters < 10_000
          ? '10'
          : current.narrationDuration
      const allowedVariations = getAllowedVariations(narrationDuration)
      const variations = allowedVariations.includes(current.variations)
        ? current.variations
        : allowedVariations[allowedVariations.length - 1]
      return { ...current, copyType, narrationDuration, variations }
    })
  }

  function updateNarrationDuration(narrationDuration: NarrationDuration) {
    setForm((current) => {
      const allowedVariations = getAllowedVariations(narrationDuration)
      const variations = allowedVariations.includes(current.variations)
        ? current.variations
        : allowedVariations[allowedVariations.length - 1]
      return { ...current, narrationDuration, variations }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    const firstError = Object.keys(nextErrors)[0] as keyof FieldErrors | undefined
    if (firstError) {
      document.getElementById(firstError)?.focus()
      return
    }

    await onGenerate({
      ...form,
      productName: form.productName.trim(),
      offer: form.offer.trim(),
      audience: form.audience.trim(),
      differentiators: form.differentiators.trim(),
    })
  }

  const inputClass =
    'mt-2 min-h-11 w-full rounded-[9px] border border-[#26364b] bg-[#0A111E] px-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-[#34465f] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60'
  const errorClass = 'mt-1.5 text-xs text-red-300'

  return (
    <section className="rounded-[14px] border border-[#1E2B3D] bg-[#111B2D] shadow-[0_16px_60px_rgba(0,0,0,0.16)]">
      <div className="border-b border-[#1E2B3D] px-4 py-4 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">
          Configuração da oferta
        </p>
        <div className="mt-1 flex flex-col justify-between gap-1 sm:flex-row sm:items-end sm:gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
            Dê contexto. Receba opções utilizáveis.
          </h1>
          <p className="shrink-0 text-xs text-slate-500">* Campos obrigatórios</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="productName" className="text-sm font-medium text-slate-200">
              Nome do produto <span className="text-cyan-300">*</span>
            </label>
            <input
              id="productName"
              value={form.productName}
              onChange={(event) => updateField('productName', event.target.value)}
              maxLength={200}
              disabled={isLoading}
              aria-invalid={Boolean(errors.productName)}
              aria-describedby={errors.productName ? 'productName-error' : undefined}
              placeholder="Ex: Programa de Gestão para Restaurantes"
              className={`${inputClass} ${errors.productName ? 'border-red-400/70' : ''}`}
            />
            {errors.productName && (
              <p id="productName-error" className={errorClass}>
                {errors.productName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="offer" className="text-sm font-medium text-slate-200">
              Preço da oferta <span className="font-normal text-slate-500">(opcional)</span>
            </label>
            <input
              id="offer"
              value={form.offer}
              onChange={(event) => updateField('offer', event.target.value)}
              maxLength={300}
              disabled={isLoading}
              placeholder="Ex: R$ 97 ou 12x de R$ 9,74"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="audience" className="text-sm font-medium text-slate-200">
              Público-alvo <span className="text-cyan-300">*</span>
            </label>
            <span className="text-[11px] text-slate-600">{form.audience.length}/1500</span>
          </div>
          <textarea
            id="audience"
            value={form.audience}
            onChange={(event) => updateField('audience', event.target.value)}
            maxLength={1500}
            rows={3}
            disabled={isLoading}
            aria-invalid={Boolean(errors.audience)}
            aria-describedby={errors.audience ? 'audience-error' : undefined}
            placeholder="Ex: Donos de restaurantes que querem aumentar os pedidos e reduzir erros operacionais"
            className={`${inputClass} resize-y py-3 leading-6 ${errors.audience ? 'border-red-400/70' : ''}`}
          />
          {errors.audience && (
            <p id="audience-error" className={errorClass}>
              {errors.audience}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="differentiators" className="text-sm font-medium text-slate-200">
              Diferenciais da oferta <span className="font-normal text-slate-500">(opcional)</span>
            </label>
            <span className="text-[11px] text-slate-600">{form.differentiators.length}/2000</span>
          </div>
          <textarea
            id="differentiators"
            value={form.differentiators}
            onChange={(event) => updateField('differentiators', event.target.value)}
            maxLength={2000}
            rows={3}
            disabled={isLoading}
            placeholder="Ex: implantação rápida, atendimento humano, sem taxa por pedido e integração com WhatsApp"
            className={`${inputClass} resize-y py-3 leading-6`}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)_160px]">
          <div>
            <label htmlFor="copyType" className="text-sm font-medium text-slate-200">
              Tipo de copy
            </label>
            <select
              id="copyType"
              value={form.copyType}
              onChange={(event) => updateCopyType(event.target.value as CopyRequest['copyType'])}
              disabled={isLoading}
              className={inputClass}
            >
              {COPY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="narrationDuration" className="text-sm font-medium text-slate-200">
              Duração e tamanho da copy
            </label>
            <select
              id="narrationDuration"
              value={form.narrationDuration}
              onChange={(event) => updateNarrationDuration(event.target.value as NarrationDuration)}
              disabled={isLoading}
              className={inputClass}
            >
              {NARRATION_DURATIONS.filter(
                (duration) =>
                  form.copyType !== 'VSL' ||
                  NARRATION_DURATION_CONFIG[duration].maximumCharacters >= 10_000,
              ).map((duration) => (
                <option key={duration} value={duration}>
                  {formatNarrationDurationOption(duration)}
                </option>
              ))}
            </select>
            <NarrationEstimate duration={form.narrationDuration} />
          </div>
          <div>
            <label htmlFor="variations" className="text-sm font-medium text-slate-200">
              Variações
            </label>
            <select
              id="variations"
              value={form.variations}
              onChange={(event) =>
                updateField('variations', Number(event.target.value) as CopyRequest['variations'])
              }
              disabled={isLoading}
              className={inputClass}
            >
              {getAllowedVariations(form.narrationDuration).map((amount) => (
                <option key={amount} value={amount}>
                  {amount} {amount === 1 ? 'copy' : 'copies'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <IntensitySlider
          value={form.intensity}
          disabled={isLoading}
          onChange={(value) => updateField('intensity', value)}
        />

        {error && (
          <div
            role="alert"
            className="rounded-[10px] border border-red-400/20 bg-red-400/7 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <GenerateButton isLoading={isLoading} />
        <p className="text-center text-[11px] leading-5 text-slate-600">
          A IA usa apenas os dados desta geração. Seu histórico permanece neste navegador.
        </p>
      </form>
    </section>
  )
}
