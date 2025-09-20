import { useStore } from "@tanstack/react-store"
import usePollingYoutubeChat from "./db.useTauriPollChat"
import { OBSOverlayTauriSettingStragery, OBSOverlayTauriSettingsProps, OBSOverlayWebsiteSettingStragery, OBSOverlayWebsiteSettingsStore } from "@/store"
import { useWebsiteChatMessage } from "@/data/db.YoutubeLiveChatCollections"

export function ChatMessageTauri() {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const { messages } = usePollingYoutubeChat()

    return { messages, showComment, currentPreset, getCorrectChatTypeDataStragery }
}

export function ChatMessageWebsite() {
    const { showComment, currentPreset } = useStore(OBSOverlayWebsiteSettingsStore)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayWebsiteSettingStragery)
    const { data: messages } = useWebsiteChatMessage()

    return { messages, showComment, currentPreset, getCorrectChatTypeDataStragery }
}