import { toast } from "sonner";
import type { WebSocketMessageType } from "@/types";
import type { websocketSendType } from "@/data/settings";

type YouTubeMessage = Extract<WebSocketMessageType, { type: typeof websocketSendType.YouTubeMessage }>

export default function WebSocketYouTubeMessage(
    data: YouTubeMessage['data']
) {
    toast.message(`📡 Server gửi: ${data[0].message}`)
}