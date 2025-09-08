import { createServerFn } from '@tanstack/react-start'
import type { ForgetEmailSchemaType, ResetPassSchemaType } from '@/types/schema';
import { getSupabaseServerClient } from '@/lib/supabase';
import { redirectSupbaseForgetURL } from '@/data/oauth';

export const fillInEmailFn = createServerFn({ method: 'POST' })
  .validator(
    (d: ForgetEmailSchemaType) => d,
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirectSupbaseForgetURL
    })

    if (error) {
      switch (error.code) {
        case "email_address_invalid":
          throw new Error("Tài khoản không tồn tại")
        default:
          throw new Error(error.message)
      }
    }

    return { success: true }
  })

export const forgetPassFn = createServerFn({ method: 'POST' })
  .validator((d: ResetPassSchemaType) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.updateUser({
      password: data.password
    })

    if (error) {
      switch (error.code) {
        case "email_address_invalid":
          throw new Error("Tài khoản không tồn tại")
        default:
          throw new Error(error.message)
      }
    }

    return { success: true }
  })