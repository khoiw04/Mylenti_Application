import type { OBSOverlayChatTypePropsType } from "../store/obs-overlay"
import type { presetUserVariantsValueType } from "../data/obs-overlay"

export type ChatTypeType = { 
    dataConfig?: OBSOverlayChatTypePropsType,
    preset?: presetUserVariantsValueType,
    avatar?: string,
    author?: string,
    comment?: string,
    show_com?: boolean
    donatePrice?: string
}