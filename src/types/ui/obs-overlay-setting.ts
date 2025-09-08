import type { OBSOverlayChatKeyPropsType } from "../store/obs-overlay";
import type { presetUserVariantsValueReadonlyType, presetUserVariantsValueType } from "../data/obs-overlay";

export type chatTypeProps = 
{
    showAvatar?: boolean;
    showCommenter?: boolean;
    showComment?: boolean;
    classNameMainContainer?: string;
    classNameUserContainer?: string;
    classNameCommenter?: string;
    classNameComment?: string;
    srcAvatarCommenter?: string
    srcTypeMember?: string
}

export type SearchProps = 
{
    value: presetUserVariantsValueType;
    onValueChange: (value: presetUserVariantsValueType) => void
    open: boolean
    onOpenChange: (boolean: boolean) => void
    selectArray: presetUserVariantsValueReadonlyType
}

export type OBSSuperchatChatKey = Exclude<OBSOverlayChatKeyPropsType, 'Superchat'>