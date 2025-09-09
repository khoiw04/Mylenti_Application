import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase';

export const getDonateDatabase = createServerFn()
  .validator((d: { user_name: string }) => d)
  .handler(async ({ data: { user_name } }) => {
    const supabase = getSupabaseServerClient()

    const { data } = await supabase
      .from('donate')
      .select('code, display_name, display_avatar, user_name, receiver, message, transfer_amount, created_at')
      .order('created_at', { ascending: false })
      .eq('receiver', user_name)
      // .eq('status', 'success')

    return data
})

export const getBankDatabase = createServerFn()
  .validator((d: { user_name: string }) => d)
  .handler(async ({ data: { user_name } }) => {
    const supabase = getSupabaseServerClient()

    const { data } = await supabase
      .from('bank_accounts')
      .select('api_key, number, full_name, bank')
      .eq('user_name', user_name)
      .single()

    return data
})