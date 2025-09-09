import { useLiveQuery } from "@tanstack/react-db"
import { useEffect, useRef } from "react"
import { useStore } from "@tanstack/react-store"
import type { LiveChatMessageType } from "@/types/collections"
import { chatMessagesLiveQueryCollection } from "@/data/db.YouTubeChatCollections"
import { getYouTubeOBSLiveChatMessage } from "@/func/db.YouTubeChatFunc"
import { IndexState } from "@/store/index-store"

export default function usePollingYoutubeChat() {
    const { finishGoogleOBSAuth } = useStore(IndexState)
    if (!finishGoogleOBSAuth) return []

    const nextPageTokenRef = useRef('')
    const pollingIntervalRef = useRef(3000)
    const { data, collection: messageCollection } = useLiveQuery(chatMessagesLiveQueryCollection)
    useEffect(() => {
        let isCancelled = false
        async function poll() {
            const { messages, nextPageToken, pollingIntervalMillis }: LiveChatMessageType =
                await getYouTubeOBSLiveChatMessage({ data: { nextPageToken: nextPageTokenRef.current } })

            if (isCancelled) return

            messages.forEach((d) => {
                messageCollection.insert(d)
            })

            nextPageTokenRef.current = nextPageToken
            pollingIntervalRef.current = pollingIntervalMillis || 3000

            setTimeout(poll, pollingIntervalRef.current)
        }

        poll()
        return () => {
            isCancelled = true
        }
    }, [])

    return data
}