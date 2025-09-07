import * as z from "zod";
import { emailSchema, nameSchema, passwordSchema, socialUsernameSchema } from "./re.schema";

export const LogUpSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    full_name: nameSchema,
    user_name: socialUsernameSchema
})

export const LogInSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})

export const ForgetEmailSchema = z.object({
    email: emailSchema
})

export const ResetPassSchema = z.object({
    password: passwordSchema
})