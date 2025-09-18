import { useStore } from "@tanstack/react-store"
import usePollingYoutubeChat from "./db.useTauriPollChat"
import { OBSOverlayTauriSettingStragery, OBSOverlayTauriSettingsProps } from "@/store"

export function ChatMessageTauri() {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const { messages } = usePollingYoutubeChat()

    return { messages, showComment, currentPreset, getCorrectChatTypeDataStragery }
}