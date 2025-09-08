import type z from "zod";
import type { updateUserNameSchema, updateUserSchema } from "@/schema/user.schema";
import type { ForgetEmailSchema, LogInSchema, LogUpSchema, ResetPassSchema } from "@/schema/logIn.schema";
import type { bankSchema } from "@/schema/bank.schema";
import type { chatMessageSchema, livestreamSchema } from "@/schema/livestream.schema";

export type bankSchemaType = z.infer<typeof bankSchema>
export type updateUserNameSchemaType = z.infer<typeof updateUserNameSchema>
export type updateUserSchemaType = z.infer<typeof updateUserSchema>
export type LogUpSchemaType = z.infer<typeof LogUpSchema>
export type LogInSchemaType = z.infer<typeof LogInSchema>
export type ForgetEmailSchemaType = z.infer<typeof ForgetEmailSchema>
export type ResetPassSchemaType = z.infer<typeof ResetPassSchema>
export type ChatMessageSchemaType = z.infer<typeof chatMessageSchema>
export type LivestreamSchemaType = z.infer<typeof livestreamSchema>