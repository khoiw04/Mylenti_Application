import * as z from "zod";
import { emailSchema, nameSchema, socialUsernameSchema } from "./re.schema";
import { BankDisplayInfo } from "@/data/bank";

export const bankSchema = z.object({
  api_key: z.string().min(1, 'API không thể thiếu'),
  number: z.string().min(1, 'Số không thể thiếu'),
  bank: z.enum(BankDisplayInfo.map(bank => bank.name)),
  user_name: socialUsernameSchema,
  full_name: nameSchema,
  email: emailSchema
})