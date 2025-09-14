import { Store } from "@tanstack/store"
import type { OBSOverlaySettingStrageryType, OBSOverlaySettingsPropsType } from "@/types"
import { initialDonateFiles } from "@/data/obs-overlay"

export const OBSOverlaySettingsProps = new Store<OBSOverlaySettingsPropsType>({
  showComment: false,
  openStatePreset: false,
  currentPreset: 'default',
  currentKeyChatType: 'Verified',
  DonateProps : {
    emojiURL: [
      {
        name: 'OMORI',
        path: initialDonateFiles[0].url,
        preview: initialDonateFiles[0].url,
        type: 'image/jpeg',
        size: 3434
      }
    ]
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

export const OBSOverlaySettingStragery = new Store<OBSOverlaySettingStrageryType>({
    currentKeyChatTypeStragery: (string) => OBSOverlaySettingsProps.setState(
      prev => ({
        ...prev,
        currentKeyChatType: string
      })
    ),
    showCommentStragery: (boolean) => OBSOverlaySettingsProps.setState(
      prev => ({
        ...prev,
        showComment: boolean
      })
    ),
    showLabelStragery: (key, field, value) => {
      OBSOverlaySettingsProps.setState(prev => ({
        ...prev,
        ChatType: prev.ChatType.map(item =>
          item.key === key
            ? {
                ...item,
                config: {
                  ...item.config,
                  [field]: value
                }
              }
            : item
        )
      }))
    },
    getCorrectChatTypeDataStragery: (value) =>
      OBSOverlaySettingsProps.state.ChatType.find(
        item => item.key === value
      )!
    ,
    openStatePresetStragery: (boolean) => 
        OBSOverlaySettingsProps.setState(
            prev => ({
                ...prev, 
                openStatePreset: boolean 
        })),
    currentPresetStragery: (value) => 
        OBSOverlaySettingsProps.setState(
            prev => ({ 
                ...prev, 
                currentPreset: value
        })),
})