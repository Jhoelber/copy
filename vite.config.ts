import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import generateCopyHandler from './api/generate-copy'

function localApiPlugin(): Plugin {
  return {
    name: 'copyforge-local-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-copy', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end(JSON.stringify({ error: 'Método não permitido.' }))
          return
        }

        if (!String(req.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) {
          res.statusCode = 415
          res.end(JSON.stringify({ error: 'Envie o conteúdo como JSON.' }))
          return
        }

        let rawBody = ''
        let payloadTooLarge = false
        req.setEncoding('utf8')
        req.on('data', (chunk: string) => {
          if (payloadTooLarge) return
          rawBody += chunk
          if (rawBody.length > 12_000) {
            payloadTooLarge = true
            rawBody = ''
          }
        })
        req.on('end', async () => {
          if (payloadTooLarge) {
            res.statusCode = 413
            res.end(JSON.stringify({ error: 'Requisição muito grande.' }))
            return
          }
          try {
            const apiResponse = await generateCopyHandler(
              new Request('http://localhost/api/generate-copy', {
                method: 'POST',
                headers: { 'Content-Type': String(req.headers['content-type'] ?? '') },
                body: rawBody,
              }),
            )
            if (!(apiResponse instanceof Response)) throw new Error('INVALID_LOCAL_API_RESPONSE')
            res.statusCode = apiResponse.status
            apiResponse.headers.forEach((value, name) => res.setHeader(name, value))
            res.end(await apiResponse.text())
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Requisição inválida.' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  }

  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
  }
})
