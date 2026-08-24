import type { HistoryEntry } from '../types/copy'
import { COPY_TYPES, type CopyType } from '../../shared/copyTypeConfig'
import {
  NARRATION_DURATIONS,
  type NarrationDuration,
} from '../../shared/narrationConfig'
import { getDefaultNarrationDuration } from './narration'

const STORAGE_KEY = 'copyforge.history.v1'
const MAX_HISTORY_ITEMS = 10

export function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(normalizeHistoryEntry)
      .filter((entry): entry is HistoryEntry => Boolean(entry))
      .slice(0, MAX_HISTORY_ITEMS)
  } catch {
    return []
  }
}

export function saveHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...readHistory().filter((item) => item.id !== entry.id)].slice(
    0,
    MAX_HISTORY_ITEMS,
  )

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // A geração continua utilizável mesmo quando o armazenamento está indisponível.
  }
  return next
}

function normalizeHistoryEntry(value: unknown): HistoryEntry | null {
  if (!value || typeof value !== 'object') return null
  const entry = value as Partial<HistoryEntry>
  if (
    typeof entry.id !== 'string' ||
    typeof entry.createdAt !== 'string' ||
    !entry.request ||
    typeof entry.request.productName !== 'string' ||
    !COPY_TYPES.includes(entry.request.copyType as CopyType) ||
    !entry.response ||
    !Array.isArray(entry.response.copies)
  ) {
    return null
  }

  const copyType = entry.request.copyType as CopyType
  const storedDuration = entry.request.narrationDuration as NarrationDuration | undefined
  const narrationDuration =
    storedDuration && NARRATION_DURATIONS.includes(storedDuration)
      ? storedDuration
      : getDefaultNarrationDuration(copyType)

  return {
    ...entry,
    request: { ...entry.request, narrationDuration },
  } as HistoryEntry
}
