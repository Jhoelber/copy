import { handleGenerateCopy } from '../server/generateCopy'

const responseHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
}

function jsonResponse(body: unknown, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...responseHeaders, ...headers },
  })
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return jsonResponse(
        { error: 'Método não permitido.', code: 'METHOD_NOT_ALLOWED' },
        405,
        { Allow: 'POST' },
      )
    }

    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return jsonResponse(
        { error: 'Envie o conteúdo como JSON.', code: 'UNSUPPORTED_MEDIA_TYPE' },
        415,
      )
    }

    const contentLength = Number(request.headers.get('content-length') ?? 0)
    if (contentLength > 12_000) {
      return jsonResponse(
        { error: 'Requisição muito grande.', code: 'PAYLOAD_TOO_LARGE' },
        413,
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Requisição inválida.', code: 'INVALID_JSON' }, 400)
    }

    const result = await handleGenerateCopy(body)
    return jsonResponse(result.body, result.status)
  },
}
