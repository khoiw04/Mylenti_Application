import { Store } from "@tanstack/store"
import type { OBSOverlaySettingsTauriPropsType, OBSOverlayTauriSettingStrageryType } from "@/types"
import { fallbackEmoji, fallbackSound } from "@/data/obs-overlay"

export const OBSOverlayTauriSettingsProps = new Store<OBSOverlaySettingsTauriPropsType>({
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

export const OBSOverlayTauriSettingStragery = new Store<OBSOverlayTauriSettingStrageryType>({
    currentKeyChatTypeStragery: (string) => OBSOverlayTauriSettingsProps.setState(
      prev => ({
        ...prev,
        currentKeyChatType: string
      })
    ),
    showCommentStragery: (boolean) => OBSOverlayTauriSettingsProps.setState(
      prev => ({
        ...prev,
        showComment: boolean
      })
    ),
    showLabelStragery: (key, field, value) => {
      OBSOverlayTauriSettingsProps.setState(prev => ({
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
      OBSOverlayTauriSettingsProps.state.ChatType.find(
        item => item.key === value
      )!
    ,
    openStatePresetStragery: (boolean) => 
        OBSOverlayTauriSettingsProps.setState(
            prev => ({
                ...prev, 
                openStatePreset: boolean 
        })),
    currentPresetStragery: (value) => 
        OBSOverlayTauriSettingsProps.setState(
            prev => ({ 
                ...prev, 
                currentPreset: value
        })),
    toogleVoiceDonatePropsStragery: (value) => 
        OBSOverlayTauriSettingsProps.setState(
            prev => ({ 
                ...prev, 
                DonateProps: {
                  ...prev.DonateProps,
                  enableVoice: value
                }
        })),
})