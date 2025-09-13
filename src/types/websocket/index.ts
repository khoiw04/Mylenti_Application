import type { YouTubeChatResponse } from "../func/youtubeOBS"

export type WebSocketMessageType = {
    data: {
        name: string,
        amount: string,
        message: string
    }
} & {
    data: YouTubeChatResponse['messages']
}