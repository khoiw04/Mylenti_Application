import { z } from "zod"

export const DonateEventSchema = z.object({
  code: z.string(),
  email: z.string().nullable().default(null),
  display_name: z.string(),
  display_avatar: z.string(),
  user_name: z.string(),
  message: z.string(),
  receiver: z.string(),

  id_transaction: z.number().int(),
  gateway: z.string(),
  transaction_date: z.string(),
  account_number: z.string(),
  content: z.string(),
  transfer_type: z.enum(["in", "out"]),
  transfer_amount: z.number().int(),
  accumulated: z.number().int(),
  sub_account: z.string(),
  reference_code: z.string(),
  description: z.string(),
  notified: z.boolean().default(false),
  status: z.enum(["error", "pending", "received"]),

  created_at: z.string()
})
