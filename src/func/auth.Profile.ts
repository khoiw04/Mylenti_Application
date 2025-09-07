import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase';

export const getProfile = createServerFn()
  .validator((d: { user_name: string }) => d)
  .handler(async ({ data: { user_name } }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('user_index')
      .select('id, user_name, full_name, avatar_url, x, youtube, facebook')
      .eq('user_name', user_name)
      .single()

    if (error) {throw new Error(error.message, { cause: error.cause ?? 500 })}

    return {
      full_name: data.full_name,
      user_name: data.user_name,
      avatar_url: data.avatar_url,
      x: data.x,
      youtube: data.youtube,
      facebook: data.facebook
    }
})