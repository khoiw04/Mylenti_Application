import { createBrowserClient } from '@supabase/ssr'

export const supabaseSSR = createBrowserClient(
    'https://npsxoeliduqmbxkvbyrw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wc3hvZWxpZHVxbWJ4a3ZieXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTk1NzIsImV4cCI6MjA3MDUzNTU3Mn0.YKpYGE610jblwjJDpVIXooGRLji2We7dA7StA1B6c1k'
)