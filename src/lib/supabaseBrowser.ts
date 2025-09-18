import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/env/client'

export const supabaseSSR = createBrowserClient(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY
)