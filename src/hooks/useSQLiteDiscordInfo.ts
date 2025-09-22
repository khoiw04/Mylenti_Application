import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import { profileQueries, useDiscordCommunityUser } from "@/lib/queries"
import { fallbackData, getDiscordUserByUserName, upsertDiscordUser } from "@/data/discord.sqlite"

export default function useSQLiteDiscordInfo() {
    const {
        meta: {
            id,
            username,
            global_name,
            email,
            avatar
        },
    } = useDiscordCommunityUser().data
    const router = useRouter()

    useEffect(() => {
        (async () => {
            if (!await getDiscordUserByUserName(username)) {
                await invoke("create_and_save_tunnel", { username });
                await upsertDiscordUser({
                    id,
                    email,
                    name: global_name,
                    user_name: username,
                    avatar: avatar
                })
            }
        })()
    }, [])

    const { data } = useQuery({
        ...profileQueries.discord(username),
        placeholderData: fallbackData,
        enabled: !router.isServer
    })

    return { data: data!, avatar }
}