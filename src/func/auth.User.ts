import { createServerFn } from '@tanstack/react-start'
import type { AuthState } from '@/types';
import { getSupabaseServerClient } from '@/lib/supabase';

export const getUser = createServerFn().handler<AuthState>(async () => {
  const supabase = getSupabaseServerClient();

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return { 
      isAuthenticated: false,
      user: {
        email: '',
        meta: { display_name: null, display_avatar: null, full_name: '', user_name: '', avatar_url: null, name: '', x: null, youtube: null, facebook: null },
      },
    }
  }

  const meta = data.user.user_metadata;

  return {
    isAuthenticated: true,
    user: {
      email: data.user.email ?? '',
      meta: {
        display_name: meta.full_name ?? null,
        display_avatar: meta.display_avatar ?? meta.avatar_url ?? null,

        full_name: meta.full_name ?? '',
        user_name: meta.user_name ?? '',
        name: meta.name ?? '',

        avatar_url: meta.avatar_url ?? null,

        x: meta.x ?? null,
        youtube: meta.youtube ?? null,
        facebook: meta.facebook ?? null,
      },
    },
  };
});