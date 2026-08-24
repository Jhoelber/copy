import type { CopyRequest, CopyResponse } from '../../shared/copySchemas'

export type { CopyRequest, CopyResponse }
export type GeneratedCopy = CopyResponse['copies'][number]

export type FieldErrors = Partial<Record<'productName' | 'offer' | 'audience', string>>

export interface HistoryEntry {
  id: string
  createdAt: string
  request: CopyRequest
  response: CopyResponse
}

export type ConnectionStatus = 'idle' | 'connected' | 'unavailable'
