import { z } from 'zod'

export const chatMessageSchema = z.object({
  id: z.string(),
  author: z.string(),
  message: z.string(),
  publishedAt: z.string(),
})

export const livestreamSchema = z.object({
  id: z.string(),
  title: z.string(),
  videoId: z.string(),
  liveChatId: z.string().optional(),
  isLive: z.boolean(),
})