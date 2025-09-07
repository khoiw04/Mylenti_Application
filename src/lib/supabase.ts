import { parseCookies, setCookie } from '@tanstack/react-start/server'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/env/server'

export type SupabaseType = SupabaseClient<any, "public", any>

export const supabaseUrl = 'https://npsxoeliduqmbxkvbyrw.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wc3hvZWxpZHVxbWJ4a3ZieXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTk1NzIsImV4cCI6MjA3MDUzNTU3Mn0.YKpYGE610jblwjJDpVIXooGRLji2We7dA7StA1B6c1k';

export function getSupabaseServerClient() {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return Object.entries(parseCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value)
          })
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  )
}