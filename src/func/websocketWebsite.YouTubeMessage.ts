import type { YouTubeMessage } from "@/types"
import { chatWebsiteMessageCollection } from "@/components/containers/db.YoutubeLiveChatCollections"

export default function WebSocketYouTubeMessage(
    data: YouTubeMessage['data']
) {
    data.forEach(msg => {
        chatWebsiteMessageCollection.utils.writeInsert(msg)
    })
}