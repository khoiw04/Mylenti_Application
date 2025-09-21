import { createServerFn } from '@tanstack/react-start'
import type { Provider } from '@supabase/supabase-js'
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { APPCONFIG } from '@/data/config';

export const signInWithOauth = createServerFn({ method: 'POST' })
  .validator(
    (d: { provider: Provider; }) => d,
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: userData, error } = await supabase.auth.signInWithOAuth({
        provider: data.provider,
        options: {
          redirectTo: APPCONFIG.URL.REDIRECTSUPABASEOAUTHURL,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }

    if (userData.url) {
      return {
        redirectUrl: userData.url
      }
    }
    throw new Error("Có gì đó đã sai")
  })

export const exchangeCodeForSession = createServerFn({ method: 'POST' })
  .validator((d: { code: string }) => d)
  .handler(async ({ data: { code } }) => {

    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) throw new Error(error.message, { cause: error.cause ?? 500 })

    return { success: true }
  })

export const exchangeCodeInClient = async () => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (code) { 
    const res = await exchangeCodeForSession({ data: { code } })

    return res
  }
}