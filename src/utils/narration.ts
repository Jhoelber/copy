import { COPY_TYPE_CONFIG, type CopyType } from '../../shared/copyTypeConfig'
import type { GeneratedCopy } from '../types/copy'

export const NARRATION_SPEEDS = {
  slow: 750,
  normal: 900,
  fast: 1050,
} as const

export const NARRATION_CHARS_PER_MINUTE = NARRATION_SPEEDS.normal

const characterFormatter = new Intl.NumberFormat('pt-BR')

export function getNarrationText(copy: Pick<GeneratedCopy, 'headline' | 'body' | 'cta'>) {
  return [copy.headline, copy.body, copy.cta]
    .filter((text): text is string => Boolean(text?.trim()))
    .join('\n\n')
}

export function countNarrationCharacters(copy: Pick<GeneratedCopy, 'headline' | 'body' | 'cta'>) {
  return getNarrationText(copy).length
}

export function estimateNarrationTime(
  characterCount: number,
  charactersPerMinute = NARRATION_CHARS_PER_MINUTE,
) {
  const safeCharacterCount = Math.max(0, characterCount)
  const safeSpeed = charactersPerMinute > 0 ? charactersPerMinute : NARRATION_CHARS_PER_MINUTE
  const totalSeconds = Math.round((safeCharacterCount / safeSpeed) * 60)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) return `${seconds}s`
  if (seconds === 0) return `${minutes}min`
  return `~${minutes}min${String(seconds).padStart(2, '0')}s`
}

export function formatCharacterCount(characterCount: number) {
  return characterFormatter.format(characterCount)
}

export function getCopyTypeEstimate(copyType: CopyType) {
  const config = COPY_TYPE_CONFIG[copyType]
  if (config.targetCharacters) {
    return `~${formatCharacterCount(config.targetCharacters)} caracteres • ${estimateNarrationTime(config.targetCharacters)} de narração`
  }

  if ('minimumCharacters' in config && config.minimumCharacters) {
    return `${formatCharacterCount(config.minimumCharacters)}+ caracteres • ${estimateNarrationTime(config.minimumCharacters)}+ de narração`
  }

  return 'Tamanho e duração variáveis'
}
