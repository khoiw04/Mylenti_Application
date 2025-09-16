import type { OBSOverlaySettingsTauriPropsType } from "../store/obs-overlay"
import type { YouTubeChatResponse } from "../func/youtubeMessage"
import type { websocketSendType } from "@/data/settings"

export type WebSocketMessageType =
    {
      type: typeof websocketSendType.DonateTranscation
      data: {
        name: string
        amount: string
        message: string
      }
    }
  | {
      type: typeof websocketSendType.YouTubeMessage
      data: YouTubeChatResponse['messages']
    }
  | {
      type: typeof websocketSendType.OBSSetting
      data: OBSOverlaySettingsTauriPropsType
    }