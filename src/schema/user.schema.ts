import * as z from "zod";
import { nameSchema, nullableSocialUsernameSchema, socialUsernameSchema } from "./re.schema";

const baseSchema = z.object({
  full_name: nameSchema,
  youtube: nullableSocialUsernameSchema,
  facebook: nullableSocialUsernameSchema,
  x: nullableSocialUsernameSchema,
  image: z.string(),
  requireUserName: z.boolean(),
})

export const updateUserSchema = baseSchema;

export const updateUserNameSchema = z.object({
    user_name: socialUsernameSchema,
}).extend(baseSchema.shape);

export const discordSocialSchema = z.object({
  full_name: nameSchema,
  youtube: nullableSocialUsernameSchema,
  facebook: nullableSocialUsernameSchema,
  x: nullableSocialUsernameSchema,
})