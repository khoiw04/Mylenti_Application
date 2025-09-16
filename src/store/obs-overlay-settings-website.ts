import { Store } from "@tanstack/store"
import type { OBSOverlaySettingsWebsitePropsType } from "@/types"

export const OBSOverlaySettingsWebsiteStore = new Store<OBSOverlaySettingsWebsitePropsType>({
  currentKeyChatType: 'Moderator',
  openStatePreset: false,
  showComment: false,
  currentPreset: 'default',
  DonateProps : {
    emojiURL: [''],
    soundURL: ['']
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