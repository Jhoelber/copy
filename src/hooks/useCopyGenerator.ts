import { useCallback, useState } from 'react'
import { generateCopies } from '../services/copyApi'
import type { ConnectionStatus, CopyRequest, CopyResponse, HistoryEntry } from '../types/copy'
import { readHistory, saveHistory } from '../utils/storage'

export function useCopyGenerator() {
  const [result, setResult] = useState<CopyResponse | null>(null)
  const [lastRequest, setLastRequest] = useState<CopyRequest | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(readHistory)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')

  const generate = useCallback(async (request: CopyRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await generateCopies(request)
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        request,
        response,
      }
      setResult(response)
      setLastRequest(request)
      setHistory(saveHistory(entry))
      setConnectionStatus('connected')
      requestAnimationFrame(() => {
        document.getElementById('copy-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch (caughtError) {
      setConnectionStatus('unavailable')
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível gerar as copies. Tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const restore = useCallback((entry: HistoryEntry) => {
    setResult(entry.response)
    setLastRequest(entry.request)
    setError(null)
    requestAnimationFrame(() => {
      document.getElementById('copy-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return {
    result,
    lastRequest,
    history,
    isLoading,
    error,
    connectionStatus,
    generate,
    restore,
  }
}
