import { useMemo, useSyncExternalStore } from "react"
import { useDiscordCommunityUser } from "@/lib/queries"
import { DiscordInfoStore } from "@/store"

export default function useAuthInfo() {
    const {
        isAuthenticated,
        meta: {
            id,
            avatar,
            username,
            global_name
        },
    } = useDiscordCommunityUser().data

    const data = {
        isAuthenticated,
        meta: {
            id,
            avatar,
            username,
            global_name
        },
    }

    const props = useMemo(() => data, [])
    DiscordInfoStore.setState(props)
    return data
}

export function useDiscordAuthInfoExternalStore() {
  return useSyncExternalStore(
    DiscordInfoStore.subscribe,
    () => DiscordInfoStore.state,
    () => DiscordInfoStore.state
  )
}