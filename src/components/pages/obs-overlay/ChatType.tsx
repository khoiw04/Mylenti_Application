import { useStore } from "@tanstack/react-store"
import { VerifiedType } from "@/components/presenters/ui-chattype/VerifiedChat"
import NormalType from "@/components/presenters/ui-chattype/NormalChat"
import { OBSOverlaySettingStragery, OBSOverlaySettingsProps } from "@/store"
import ModeratorType from "@/components/presenters/ui-chattype/ModeratorChat"
import MemeberType from "@/components/presenters/ui-chattype/MemeberChat"
import SuperchatType from "@/components/presenters/ui-chattype/SuperchatChat"

export const VerifiedChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Verified')

    return <VerifiedType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        showComment={showComment}
    />
}

export const NormalChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Normal')

    return <NormalType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        showComment={showComment}
    />
}

export const ModeratorChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Moderator')

    return <ModeratorType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        showComment={showComment}
    />
}

export const MemberChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Member')

    return <MemeberType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        showComment={showComment}
    />
}

export const SuperchatChat = () => {
    const { showComment, currentPreset, currentKeyChatType } = useStore(OBSOverlaySettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Superchat')

    return <SuperchatType
        currentKeyChatType={currentKeyChatType}
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        showComment={showComment}
    />
}
