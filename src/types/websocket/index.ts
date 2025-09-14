import type { OBSOverlaySettingsPropsType } from "../store/obs-overlay"
import type { YouTubeChatResponse } from "../func/youtubeOBS"

export type WebSocketMessageType = {
    data: {
        name: string,
        amount: string,
        message: string
    }
} & {
    data: YouTubeChatResponse['messages']
} & {
    data: OBSOverlaySettingsPropsType
}