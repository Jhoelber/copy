import type { CopyRequest, CopyResponse } from '../types/copy'

interface ApiErrorBody {
  error?: string
  code?: string
}

export class CopyApiError extends Error {
  code: string

  constructor(message: string, code = 'UNKNOWN_ERROR') {
    super(message)
    this.name = 'CopyApiError'
    this.code = code
  }
}

export async function generateCopies(payload: CopyRequest): Promise<CopyResponse> {
  let response: Response

  try {
    response = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new CopyApiError('Não foi possível conectar ao serviço. Verifique sua conexão.', 'NETWORK_ERROR')
  }

  const data = (await response.json().catch(() => ({}))) as ApiErrorBody | CopyResponse
  if (!response.ok) {
    const error = data as ApiErrorBody
    throw new CopyApiError(
      error.error || 'Não foi possível gerar as copies. Tente novamente.',
      error.code,
    )
  }

  return data as CopyResponse
}
