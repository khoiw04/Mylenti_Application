import type { Provider } from "@supabase/supabase-js";
import type { SocialProps } from "@/types/ui/user";
import type { useDimension } from "@/func/useDimension";

export type OauthProps = { provider: Provider; router: any; dimension: ReturnType<typeof useDimension>['dimension'] }

type User = {
  full_name: string;
  user_name: string;
  display_name: string | null;
  display_avatar: string | null;
  avatar_url: string | null;
  name: string;
} & SocialProps;

export type AuthState =
  | {
      isAuthenticated: true
      user: {
        email: string
        meta: User
      }
    }
  | {
      isAuthenticated: false
      user: {
        email: string
        meta: User
      }
    }