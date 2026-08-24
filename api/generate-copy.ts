interface LegacyRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

interface LegacyResponse {
  setHeader(name: string, value: string): void
  status(code: number): LegacyResponse
  json(body: unknown): unknown
}

interface HandlerResult {
  status: number
  body: unknown
  headers?: Record<string, string>
}

const responseHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
}

function isWebRequest(request: Request | LegacyRequest): request is Request {
  return typeof (request as Request).json === 'function' && request.headers instanceof Headers
}

function readLegacyHeader(request: LegacyRequest, name: string) {
  const value = request.headers[name]
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

async function processRequest(
  method: string,
  contentType: string,
  contentLength: number,
  readBody: () => Promise<unknown>,
): Promise<HandlerResult> {
  if (method !== 'POST') {
    return {
      status: 405,
      body: { error: 'Método não permitido.', code: 'METHOD_NOT_ALLOWED' },
      headers: { Allow: 'POST' },
    }
  }

  if (!contentType.toLowerCase().startsWith('application/json')) {
    return {
      status: 415,
      body: { error: 'Envie o conteúdo como JSON.', code: 'UNSUPPORTED_MEDIA_TYPE' },
    }
  }

  if (contentLength > 12_000) {
    return {
      status: 413,
      body: { error: 'Requisição muito grande.', code: 'PAYLOAD_TOO_LARGE' },
    }
  }

  let body: unknown
  try {
    body = await readBody()
  } catch {
    return { status: 400, body: { error: 'Requisição inválida.', code: 'INVALID_JSON' } }
  }

  const { handleGenerateCopy } = await import('../server/generateCopy')
  return handleGenerateCopy(body)
}

export default async function handler(
  request: Request | LegacyRequest,
  response?: LegacyResponse,
): Promise<Response | unknown> {
  const webRequest = isWebRequest(request)
  const result = webRequest
    ? await processRequest(
        request.method,
        request.headers.get('content-type') ?? '',
        Number(request.headers.get('content-length') ?? 0),
        () => request.json(),
      )
    : await processRequest(
        request.method ?? 'GET',
        readLegacyHeader(request, 'content-type'),
        Number(readLegacyHeader(request, 'content-length') || 0),
        async () => {
          if (typeof request.body === 'string') return JSON.parse(request.body)
          return request.body
        },
      )

  if (response) {
    for (const [name, value] of Object.entries({
      ...responseHeaders,
      ...result.headers,
    })) {
      response.setHeader(name, value)
    }
    return response.status(result.status).json(result.body)
  }

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { ...responseHeaders, ...result.headers },
  })
}
