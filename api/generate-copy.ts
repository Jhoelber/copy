import { handleGenerateCopy } from '../server/generateCopy.ts'

interface FunctionRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

interface FunctionResponse {
  setHeader(name: string, value: string): void
  status(code: number): FunctionResponse
  json(body: unknown): unknown
}

export default async function handler(request: FunctionRequest, response: FunctionResponse) {
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Método não permitido.', code: 'METHOD_NOT_ALLOWED' })
  }

  const contentType = String(request.headers['content-type'] ?? '')
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return response
      .status(415)
      .json({ error: 'Envie o conteúdo como JSON.', code: 'UNSUPPORTED_MEDIA_TYPE' })
  }

  const contentLength = Number(request.headers['content-length'] ?? 0)
  if (contentLength > 12_000) {
    return response.status(413).json({ error: 'Requisição muito grande.', code: 'PAYLOAD_TOO_LARGE' })
  }

  const result = await handleGenerateCopy(request.body)
  return response.status(result.status).json(result.body)
}
