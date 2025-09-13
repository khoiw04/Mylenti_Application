import { createServerFn } from '@tanstack/react-start'
import type { LogInSchemaType, LogUpSchemaType } from '@/types';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { redirectSupbaseSignUpUrl } from '@/data/oauth';

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: LogInSchemaType) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) {
      throw new Error(error.message, { cause: error.cause ?? 500 })
    }

    return { success: true }
  })


export const signupFn = createServerFn({ method: 'POST' })
  .validator(
    (d: LogUpSchemaType) => d,
  )
  .handler(async ({ data: { email, password, full_name, user_name } }) => {
    const supabase = getSupabaseServerClient()
    const { data: existingUser, error: checkError } = await supabase
      .from('user_index')
      .select('id')
      .eq('user_name', user_name)
      .maybeSingle();

    if (checkError) {
      throw new Error("Không thể kiểm tra username");
    }

    if (existingUser) {
      throw new Error("Tên người dùng đã tồn tại");
    }

    const { data: userData, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: full_name,
          full_name: full_name,
          user_name: user_name
        },
        emailRedirectTo: redirectSupbaseSignUpUrl
      }
    })

    if (error) {
      switch (error.code) {
        case "email_exists":
          throw new Error("Tài khoản đã tồn tại")
        default:
          throw new Error(error.message)
      }
    }

    if (userData.user) {
      return userData.user.id
    }

    throw new Error("Có gì đó đã sai")
  })

export const logoutFn = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message, { cause: error.cause ?? 500 })
  }

  new Response('Logged out', {
    headers: {
      'Set-Cookie': 'sb-access-token=deleted; Max-Age=0; Path=/;',
    },
  })
})