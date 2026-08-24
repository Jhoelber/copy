import type { HistoryEntry } from '../types/copy'

const STORAGE_KEY = 'copyforge.history.v1'
const MAX_HISTORY_ITEMS = 10

export function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isHistoryEntry).slice(0, MAX_HISTORY_ITEMS)
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

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<HistoryEntry>
  return Boolean(
    typeof entry.id === 'string' &&
      typeof entry.createdAt === 'string' &&
      entry.request &&
      typeof entry.request.productName === 'string' &&
      entry.response &&
      Array.isArray(entry.response.copies),
  )
}
