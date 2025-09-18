import { toast } from "sonner"
import type { YouTubeMessage } from "@/types"
import { chatWebsiteMessageCollection } from "@/data/db.YouTubeChatCollections"

export default function WebSocketYouTubeMessage(
    data: YouTubeMessage['data']
) {
    data.forEach(msg => {
        chatWebsiteMessageCollection.utils.writeInsert(msg)
    })
    toast.message(`📡 Server gửi: ${data[0].message}`)
}