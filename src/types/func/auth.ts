import type { Provider } from "@supabase/supabase-js";
import type { SocialProps } from "@/types";
import type { useDimension } from "@/hooks/useDimension";

export type OauthProps = { provider: Provider; router: any; dimension: ReturnType<typeof useDimension>['dimension'] }

type SupabaseUser = {
  full_name: string;
  user_name: string;
  display_name: string | null;
  display_avatar: string | null;
  avatar_url: string | null;
  name: string;
} & SocialProps;

type DiscordUser = {
  id: string,
  username: string,
  global_name: string,
  avatar: string,
  email: string,
}

export type AuthState =
  | {
      isAuthenticated: true
      user: {
        email: string
        meta: SupabaseUser
      }
    }
  | {
      isAuthenticated: false
      user: {
        email: string
        meta: SupabaseUser
      }
    }

export type AuthDiscordState =
  | {
      isAuthenticated: true
      meta: DiscordUser
    }
  | {
      isAuthenticated: false
      meta: DiscordUser
    }

