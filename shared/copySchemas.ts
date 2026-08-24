import { z } from 'zod'
import { COPY_TYPES } from './copyTypeConfig'

export { COPY_TYPES } from './copyTypeConfig'

export const VARIATION_OPTIONS = [1, 3, 5, 10] as const

export const copyRequestSchema = z
  .object({
    productName: z.string().trim().min(2).max(200),
    offer: z.string().trim().max(300),
    audience: z.string().trim().min(10).max(1500),
    differentiators: z.string().trim().max(2000),
    copyType: z.enum(COPY_TYPES),
    variations: z.union([z.literal(1), z.literal(3), z.literal(5), z.literal(10)]),
    intensity: z.number().int().min(0).max(100),
  })
  .strict()

export const generatedCopySchema = z.object({
  id: z.number().int().positive(),
  angle: z.string().trim().min(1).max(100),
  headline: z.string().trim().max(300),
  body: z.string().trim().min(1).max(40_000),
  cta: z.string().trim().max(300),
})

export const copyResponseSchema = z.object({
  copies: z.array(generatedCopySchema).min(1).max(10),
})

export type CopyRequest = z.infer<typeof copyRequestSchema>
export type CopyResponse = z.infer<typeof copyResponseSchema>
