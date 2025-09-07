import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase';

export const getDonate = createServerFn()
  .validator((d: { user_name: string }) => d)
  .handler(async ({ data: { user_name } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('donate')
      .select('code, display_name, display_avatar, user_name, receiver, message, transfer_amount, created_at')
      .order('created_at', { ascending: false })
      .eq('receiver', user_name)
      // .eq('status', 'success')

    if (error) throw new Error(error.message)

    return data
})

export const getBank = createServerFn()
  .validator((d: { user_name: string }) => d)
  .handler(async ({ data: { user_name } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('bank_accounts')
      .select('api_key, number, full_name, bank')
      .eq('user_name', user_name)
      .single()

    if (error) {throw new Error(error.message, { cause: error.cause ?? 500 })}

    return data
})