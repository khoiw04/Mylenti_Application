import { Store } from "@tanstack/store"
import type { OBSOverlaySettingsWebsitePropsType, OBSOverlayWebsiteSettingStrageryType } from "@/types"
import { fallbackEmoji, fallbackSound } from "@/data/obs-overlay"

export const OBSOverlayWebsiteSettingsStore = new Store<OBSOverlaySettingsWebsitePropsType>({
  showComment: true,
  openStatePreset: false,
  currentPreset: 'default',
  currentKeyChatType: 'Verified',
  DonateProps : {
    emojiURL: fallbackEmoji,
    soundURL: fallbackSound,
    enableVoice: false,
  },
  ChatType: [
    {
      key: 'Verified',
      label: 'Đã Xác Minh',
      config: {
        commenter_avatar: true,
        commenter_color: '',
        commenter_effect: () => undefined,
        commenter_name: true,
      },
    },
    {
      key: 'Member',
      label: 'Thành Viên',
      config: {
        commenter_avatar: true,
        commenter_color: '#22c55e',
        commenter_effect: () => console.log('Member effect triggered'),
        commenter_name: true,
      },
    },
    {
      key: 'Superchat',
      label: 'Superchat',
      config: {
        commenter_avatar: true,
        commenter_color: '',
        commenter_effect: () => undefined,
        commenter_name: true,
      },
    },
    {
      key: 'Moderator',
      label: 'Kiểm Duyệt',
      config: {
        commenter_avatar: true,
        commenter_color: '',
        commenter_effect: () => undefined,
        commenter_name: true,
      },
    },
    {
      key: 'Normal',
      label: 'Bình Thường',
      config: {
        commenter_avatar: true,
        commenter_color: '',
        commenter_effect: () => undefined,
        commenter_name: true,
      },
    },
  ],
})

export const OBSOverlayWebsiteSettingStragery = new Store<OBSOverlayWebsiteSettingStrageryType>({
    getCorrectChatTypeDataStragery: (value) =>
      OBSOverlayWebsiteSettingsStore.state.ChatType.find(
        item => item.key === value
      )!
    ,
})