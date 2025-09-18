import type { ComponentProps } from "react"
import type { presetUserVariantsValueType } from "../data/obs-overlay"
import type { FormattedChatMessage } from "../func/youtubeMessage"
import type { OBSOverlayTauriSettingStrageryType } from "@/types/store/obs-overlay"

export type ChatMessagesType = {
    messages: Array<FormattedChatMessage>
    config: {
        currentPreset: presetUserVariantsValueType
        showComment: boolean
        getCorrectChatTypeDataStragery: 
            OBSOverlayTauriSettingStrageryType['getCorrectChatTypeDataStragery']
    }
} & ComponentProps<'ul'>