import { useStore } from "@tanstack/react-store"
import type { ChatTypeType } from "@/types/ui/chattype"
import { VerifiedType } from "@/components/presenters/ui-chattype/VerifiedChat"
import NormalType from "@/components/presenters/ui-chattype/NormalChat"
import { OBSOverlayTauriSettingStragery, OBSOverlayTauriSettingsProps } from "@/store"
import ModeratorType from "@/components/presenters/ui-chattype/ModeratorChat"
import MemberType from "@/components/presenters/ui-chattype/MemberChat"
import SuperchatType from "@/components/presenters/ui-chattype/SuperchatChat"
import { commentParagraphTest, commenter_name_test } from "@/data/obs-overlay"

export const VerifiedChat = ({ dataConfig, preset, avatar, author, comment, show_com }: ChatTypeType) => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const data = dataConfig ?? getCorrectChatTypeDataStragery('Verified')

    return <VerifiedType
        currentPreset={preset ?? currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        srcCommentCommmenter={comment ?? commentParagraphTest}
        srcAvatarCommenter ={avatar ?? "./avatar-80-07.jpg"}
        srcNameCommenter={author ?? commenter_name_test}
        showComment={show_com ?? showComment}
    />
}

export const NormalChat = ({ dataConfig, preset, avatar, author, comment, show_com }: ChatTypeType) => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const data = dataConfig ?? getCorrectChatTypeDataStragery('Normal')

    return <NormalType
        currentPreset={preset ?? currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        srcCommentCommmenter={comment ?? commentParagraphTest}
        srcAvatarCommenter ={avatar ?? "./avatar-80-07.jpg"}
        srcNameCommenter={author ?? commenter_name_test}
        showComment={show_com ?? showComment}
    />
}

export const ModeratorChat = ({ dataConfig, preset, avatar, author, comment, show_com }: ChatTypeType) => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const data = dataConfig ?? getCorrectChatTypeDataStragery('Moderator')

    return <ModeratorType
        currentPreset={preset ?? currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        srcCommentCommmenter={comment ?? commentParagraphTest}
        srcAvatarCommenter ={avatar ?? "./avatar-80-07.jpg"}
        srcNameCommenter={author ?? commenter_name_test}
        showComment={show_com ?? showComment}
    />
}

export const MemberChat = ({ dataConfig, preset, avatar, author, comment, show_com }: ChatTypeType) => {
    const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const data = dataConfig ?? getCorrectChatTypeDataStragery('Member')

    return <MemberType
        currentPreset={preset ?? currentPreset}
        showAvatar={data?.config.commenter_avatar}
        showCommenter={data?.config.commenter_name}
        srcCommentCommmenter={comment ?? commentParagraphTest}
        srcAvatarCommenter ={avatar ?? "./avatar-80-07.jpg"}
        srcNameCommenter={author ?? commenter_name_test}
        showComment={show_com ?? showComment}
    />
}

export const SuperchatChat = ({ dataConfig, preset, avatar, author, comment, show_com }: ChatTypeType) => {
    const { showComment, currentPreset, currentKeyChatType } = useStore(OBSOverlayTauriSettingsProps)
    const { getCorrectChatTypeDataStragery } = useStore(OBSOverlayTauriSettingStragery)
    const data = dataConfig ?? getCorrectChatTypeDataStragery('Superchat')

    if (currentKeyChatType === 'Donate') return <></>

    return <SuperchatType
        currentKeyChatType={"Normal"}
        showAvatar={data?.config.commenter_avatar}
        currentPreset={preset ?? currentPreset}
        showCommenter={data?.config.commenter_name}
        srcCommentCommmenter={comment ?? commentParagraphTest}
        srcAvatarCommenter ={avatar ?? "./avatar-80-07.jpg"}
        srcNameCommenter={author ?? commenter_name_test}
        showComment={show_com ?? showComment}
    />
}
