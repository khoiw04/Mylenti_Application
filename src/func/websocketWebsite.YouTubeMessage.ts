import { toast } from "sonner"
import type { YouTubeMessage } from "@/types"

export default function WebSocketYouTubeMessage(
    data: YouTubeMessage['data']
) {
    toast.message(`📡 Server gửi: ${data[0].message}`)
}