import { GoogleGenAI } from '@google/genai'
import {
  copyRequestSchema,
  copyResponseSchema,
  type CopyResponse,
} from '../shared/copySchemas'
import { buildCopyPrompt, SYSTEM_INSTRUCTION } from './prompt'

type ApiResult =
  | { status: 200; body: CopyResponse }
  | { status: 400 | 500 | 503 | 504; body: { error: string; code: string } }

const outputJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    copies: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'integer', minimum: 1, description: 'Número sequencial da versão.' },
          angle: { type: 'string', description: 'Ângulo comercial principal da versão.' },
          headline: { type: 'string', description: 'Título; vazio apenas quando o formato dispensar.' },
          body: { type: 'string', description: 'Texto principal completo da copy.' },
          cta: { type: 'string', description: 'Chamada para ação; vazia apenas quando inadequada.' },
        },
        required: ['id', 'angle', 'headline', 'body', 'cta'],
      },
    },
  },
  required: ['copies'],
} as const

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), milliseconds)
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export async function handleGenerateCopy(rawBody: unknown): Promise<ApiResult> {
  const parsedInput = copyRequestSchema.safeParse(rawBody)
  if (!parsedInput.success) {
    return {
      status: 400,
      body: { error: 'Revise os campos enviados e tente novamente.', code: 'INVALID_PAYLOAD' },
    }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      status: 503,
      body: { error: 'O serviço de IA ainda não foi configurado.', code: 'AI_NOT_CONFIGURED' },
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: buildCopyPrompt(parsedInput.data),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseJsonSchema: outputJsonSchema,
        },
      }),
      45_000,
    )

    const rawText = response.text
    if (!rawText) throw new Error('EMPTY_GEMINI_RESPONSE')

    const parsedResponse = copyResponseSchema.safeParse(JSON.parse(rawText))
    if (!parsedResponse.success || parsedResponse.data.copies.length !== parsedInput.data.variations) {
      throw new Error('INVALID_GEMINI_RESPONSE')
    }

    return { status: 200, body: parsedResponse.data }
  } catch (error) {
    if (error instanceof Error && error.message === 'GEMINI_TIMEOUT') {
      return {
        status: 504,
        body: { error: 'A geração demorou mais que o esperado. Tente novamente.', code: 'AI_TIMEOUT' },
      }
    }

    return {
      status: 500,
      body: { error: 'Não foi possível gerar as copies. Tente novamente.', code: 'AI_GENERATION_FAILED' },
    }
  }
}
