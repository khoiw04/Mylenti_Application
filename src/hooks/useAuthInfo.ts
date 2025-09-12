import { useMemo, useSyncExternalStore } from "react";
import { useAuthenticatedUser } from "@/lib/queries";
import { authInfoStore } from "@/store";

export default function useAuthInfo() {
  const {
    isAuthenticated,
    user: {
      email,
      meta: { display_name, full_name, display_avatar, avatar_url: fallback_avatar, user_name: currentUser, facebook, x, youtube },
    },
  } = useAuthenticatedUser().data

  const data = {
    isAuthenticated,
    email,
    currentUser,
    display_name: display_name ?? full_name,
    display_avatar: display_avatar ?? fallback_avatar ?? '',
    socialInfo: {
      facebook: facebook ?? '',
      x: x ?? '',
      youtube: youtube ?? '',
    },
  }

  const props = useMemo(() => data, [])
  authInfoStore.setState(props)
  return data
}

export function useAuthInfoExternalStore() {
  return useSyncExternalStore(
    authInfoStore.subscribe,
    () => authInfoStore.state,
    () => authInfoStore.state
  )
}