export type OBSOverlayStateType = {
    openPreset: boolean
    valuePreset: string
}

export type OBSOverlayStateStrageryType = {
    openPresetStragery: (boolean: boolean) => void
    valuePresetStragery: (value: string) => void
}

export type OBSOverlayChatLabelPropsType = OBSOverlayChatTypePropsType['label']
export type OBSOverlayChatKeyPropsType = OBSOverlayChatTypePropsType['key']
export type OBSOverlayConfigChatTypeField = 'commenter_avatar' | 'commenter_name';

export type OBSOverlayChatTypePropsType = {
    key: 'Fan Funding' | 'Superchat' | 'Moderator' | 'Member' | 'Verified' | 'Normal'
    label: 'Ủng Hộ' | 'Superchat' | 'Kiểm Duyệt' | 'Thành Viên' | 'Đã Xác Minh' | 'Bình Thường'
    config: {
        commenter_color: string
        commenter_avatar: boolean
        commenter_name: boolean
        commenter_effect: () => void | undefined
    }
}

export type OBSOverlaySettingsPropsType = {
  showComment: boolean;
  currentState: OBSOverlayChatLabelPropsType,
  ChatType: Array<OBSOverlayChatTypePropsType>;
}


export type OBSOverlaySettingStrageryType = {
    currentStateStragery: (string: OBSOverlayChatLabelPropsType) => void
    showCommentStragery: (boolean: boolean) => void
    getCorrectChatTypeDataStragery: (string: OBSOverlayChatKeyPropsType) => OBSOverlayChatTypePropsType | null
    showAvatarStragery: <T extends OBSOverlayConfigChatTypeField>(
        key: string,
        field: T,
        value: boolean
    ) => void
}