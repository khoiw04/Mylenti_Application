import { createBrowserClient } from '@supabase/ssr'
import { supabaseKey, supabaseUrl } from './supabaseServer'

export const supabaseSSR = createBrowserClient(
    supabaseUrl,
    supabaseKey
)