import { z } from 'zod'

export const chatMessageSchema = z.object({
  id: z.string(),
  author: z.string(),
  message: z.string(),
  publishedAt: z.string(),
})