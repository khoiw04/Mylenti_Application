import { useStore } from "@tanstack/react-store"
import { VerifiedType } from "@/components/presenters/ui-chattype/VerifiedChat"
import NormalType from "@/components/presenters/ui-chattype/NormalChat"
import { OBSOverlaySettingStragery, OBSOverlayTauriSettingsProps } from "@/store"
import ModeratorType from "@/components/presenters/ui-chattype/ModeratorChat"
import MemberType from "@/components/presenters/ui-chattype/MemberChat"
import SuperchatType from "@/components/presenters/ui-chattype/SuperchatChat"
import { commentParagraphTest, commenter_name_test } from "@/data/obs-overlay"

export const VerifiedChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Verified')

    return <VerifiedType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        srcCommentCommmenter={commentParagraphTest}
        srcAvatarCommenter ={"./avatar-80-07.jpg"}
        srcNameCommenter={commenter_name_test}
        showComment={showComment}
    />
}

export const NormalChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Normal')

    return <NormalType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        srcCommentCommmenter={commentParagraphTest}
        srcAvatarCommenter ={"./avatar-80-07.jpg"}
        srcNameCommenter={commenter_name_test}
        showComment={showComment}
    />
}

export const ModeratorChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Moderator')

    return <ModeratorType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        srcCommentCommmenter={commentParagraphTest}
        srcAvatarCommenter ={"./avatar-80-07.jpg"}
        srcNameCommenter={commenter_name_test}
        showComment={showComment}
    />
}

export const MemberChat = () => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Member')

    return <MemberType
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        srcCommentCommmenter={commentParagraphTest}
        srcAvatarCommenter ={"./avatar-80-07.jpg"}
        srcNameCommenter={commenter_name_test}
        showComment={showComment}
    />
}

export const SuperchatChat = () => {
    const { showComment, currentPreset, currentKeyChatType } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
    const data = getCorrectChatTypeDataStragery('Superchat')

    if (currentKeyChatType === 'Donate') return <></>

    return <SuperchatType
        currentKeyChatType={currentKeyChatType}
        currentPreset={currentPreset}
        showAvatar={data?.config.commenter_avatar}
        srcCommentCommmenter={commentParagraphTest}
        srcAvatarCommenter ={"./avatar-80-07.jpg"}
        srcNameCommenter={commenter_name_test}
        showComment={showComment}
    />
}
