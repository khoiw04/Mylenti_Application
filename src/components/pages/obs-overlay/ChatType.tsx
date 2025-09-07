import { useStore } from "@tanstack/react-store"
import { VerifiedType } from "./ui-chattype/VerifiedChat"
import { NormalType } from "./ui-chattype/NormalChat"
import { OBSOverlaySettingStragery, OBSOverlaySettingsProps } from "@/store/obs-overlay-store"

export const VerifiedChat = () => {
    const { showComment } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Verified')

    return <VerifiedType
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        verifiedIconStyle='default'
        showComment={showComment}
    />
}

export const NormalChat = () => {
    const { showComment } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Normal')

    return <NormalType
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        showComment={showComment}
    />
}