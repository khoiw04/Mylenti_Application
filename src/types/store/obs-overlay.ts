import type { FileWithPreview } from "../func/useFileUpload";
import type { presetUserVariantsValueType } from "../data/obs-overlay"

export type OBSOverlayChatLabelPropsType = OBSOverlayChatTypePropsType['label']
export type OBSOverlayChatKeyPropsType = OBSOverlayChatTypePropsType['key']
export type OBSOverlayAllKeyPropsType = OBSOverlayChatKeyPropsType | 'Donate'
export type OBSOverlayConfigChatTypeField = 'commenter_avatar' | 'commenter_name';

export type OBSOverlayChatTypePropsType = {
    key: 'Superchat' | 'Moderator' | 'Member' | 'Verified' | 'Normal'
    label: 'Superchat' | 'Kiểm Duyệt' | 'Thành Viên' | 'Đã Xác Minh' | 'Bình Thường'
    config: {
        commenter_color: string
        commenter_avatar: boolean
        commenter_name: boolean
        commenter_effect: () => void | undefined
    }
}

export type OBSOverlaySettingsTauriPropsType = {
    openStatePreset: boolean
    showComment: boolean;
    currentPreset: presetUserVariantsValueType
    currentKeyChatType: OBSOverlayAllKeyPropsType,
    ChatType: Array<OBSOverlayChatTypePropsType>;
    DonateProps: OBSOverlayDonateTauriPropsType
}

export type OBSOverlaySettingsWebsitePropsType = {
    openStatePreset: boolean
    showComment: boolean;
    currentPreset: presetUserVariantsValueType
    currentKeyChatType: OBSOverlayAllKeyPropsType
    ChatType: Array<OBSOverlayChatTypePropsType>
    DonateProps: OBSOverlayDonateWebsitePropsType
}

export type OBSOverlayDonateTauriPropsType = {
    emojiURL: Array<FileWithPreview>
    soundURL: Array<FileWithPreview>
    enableVoice: boolean
}

export type OBSOverlayDonateWebsitePropsType = {
    emojiURL: Array<FileWithPreview>
    soundURL: Array<FileWithPreview>
    enableVoice: boolean
}

export type OBSOverlayTauriSettingStrageryType = {
    openStatePresetStragery: (boolean: boolean) => void
    currentPresetStragery: (value: presetUserVariantsValueType) => void
    currentKeyChatTypeStragery: (string: OBSOverlayAllKeyPropsType) => void
    showCommentStragery: (boolean: boolean) => void
    getCorrectChatTypeDataStragery: (string: OBSOverlayChatKeyPropsType) => OBSOverlayChatTypePropsType | null
    showLabelStragery: <T extends OBSOverlayConfigChatTypeField>(
        key: string,
        field: T,
        value: boolean
    ) => void
    toogleVoiceDonatePropsStragery: (boolean: boolean) => void
}

export type OBSOverlayWebsiteSettingStrageryType = {
    getCorrectChatTypeDataStragery: (string: OBSOverlayChatKeyPropsType) => OBSOverlayChatTypePropsType | null
}