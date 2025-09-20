import type z from "zod";
import type { ForgetEmailSchema, LogInSchema, LogUpSchema, ResetPassSchema, bankSupabaseSchema, chatMessageSchema, discordSocialSchema, updateUserNameSchema, updateUserSchema, webhookSepaySchema } from "@/schema";

export type bankSupabaseSchemaType = z.infer<typeof bankSupabaseSchema>
export type updateUserNameSchemaType = z.infer<typeof updateUserNameSchema>
export type updateUserSchemaType = z.infer<typeof updateUserSchema>
export type LogUpSchemaType = z.infer<typeof LogUpSchema>
export type LogInSchemaType = z.infer<typeof LogInSchema>
export type ForgetEmailSchemaType = z.infer<typeof ForgetEmailSchema>
export type ResetPassSchemaType = z.infer<typeof ResetPassSchema>
export type ChatMessageSchemaType = z.infer<typeof chatMessageSchema>
export type DiscordSocialSchemaType = z.infer<typeof discordSocialSchema>
export type WebhookSepaySchemaType = z.infer<typeof webhookSepaySchema>