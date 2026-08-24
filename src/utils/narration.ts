import { COPY_TYPE_CONFIG, type CopyType } from '../../shared/copyTypeConfig'
import {
  NARRATION_DURATION_CONFIG,
  NARRATION_DURATIONS,
  type NarrationDuration,
} from '../../shared/narrationConfig'
import type { GeneratedCopy } from '../types/copy'

const characterFormatter = new Intl.NumberFormat('pt-BR')

export function getNarrationText(copy: Pick<GeneratedCopy, 'headline' | 'body' | 'cta'>) {
  return [copy.headline, copy.body, copy.cta]
    .filter((text): text is string => Boolean(text?.trim()))
    .join('\n\n')
}

export function countNarrationCharacters(copy: Pick<GeneratedCopy, 'headline' | 'body' | 'cta'>) {
  return getNarrationText(copy).length
}

export function estimateNarrationTime(characterCount: number) {
  const safeCharacterCount = Math.max(0, Math.round(characterCount))
  const firstRange = NARRATION_DURATION_CONFIG[NARRATION_DURATIONS[0]]
  const lastRange = NARRATION_DURATION_CONFIG[NARRATION_DURATIONS[NARRATION_DURATIONS.length - 1]]

  if (safeCharacterCount < firstRange.minimumCharacters) return 'menos de 1 min'
  if (safeCharacterCount > lastRange.maximumCharacters) return 'mais de 60 min'

  const closestRange = NARRATION_DURATIONS.map(
    (duration) => NARRATION_DURATION_CONFIG[duration],
  ).reduce((closest, range) => {
    const distance =
      safeCharacterCount < range.minimumCharacters
        ? range.minimumCharacters - safeCharacterCount
        : safeCharacterCount > range.maximumCharacters
          ? safeCharacterCount - range.maximumCharacters
          : 0
    const closestDistance =
      safeCharacterCount < closest.minimumCharacters
        ? closest.minimumCharacters - safeCharacterCount
        : safeCharacterCount > closest.maximumCharacters
          ? safeCharacterCount - closest.maximumCharacters
          : 0

    return distance < closestDistance ? range : closest
  }, firstRange)

  return `~${closestRange.minutes} min`
}

export function formatCharacterCount(characterCount: number) {
  return characterFormatter.format(characterCount)
}

export function formatNarrationDurationOption(duration: NarrationDuration) {
  const config = NARRATION_DURATION_CONFIG[duration]
  const unit = config.minutes === 1 ? 'minuto' : 'minutos'
  return `${config.minutes} ${unit} — ${formatCharacterCount(config.minimumCharacters)} a ${formatCharacterCount(config.maximumCharacters)} caracteres`
}

export function findClosestNarrationDuration(characterCount: number): NarrationDuration {
  return NARRATION_DURATIONS.reduce((closest, duration) => {
    const range = NARRATION_DURATION_CONFIG[duration]
    const closestRange = NARRATION_DURATION_CONFIG[closest]
    const distance = Math.abs((range.minimumCharacters + range.maximumCharacters) / 2 - characterCount)
    const closestDistance = Math.abs(
      (closestRange.minimumCharacters + closestRange.maximumCharacters) / 2 - characterCount,
    )
    return distance < closestDistance ? duration : closest
  }, NARRATION_DURATIONS[0])
}

export function getDefaultNarrationDuration(copyType: CopyType): NarrationDuration {
  const config = COPY_TYPE_CONFIG[copyType]
  const characterCount =
    'minimumCharacters' in config ? config.minimumCharacters : config.targetCharacters
  return characterCount ? findClosestNarrationDuration(characterCount) : '1'
}
