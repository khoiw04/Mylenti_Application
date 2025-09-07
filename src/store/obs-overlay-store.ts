import { Store } from "@tanstack/store"
import type { OBSOverlaySettingStrageryType, OBSOverlaySettingsPropsType, OBSOverlayStateStrageryType, OBSOverlayStateType } from "@/types/store/obs-overlay"

export const OBSOverlayState = new Store<OBSOverlayStateType>({
    openPreset: false,
    valuePreset: ''
})

export const OBSOverlayStateStragery = new Store<OBSOverlayStateStrageryType>({
    openPresetStragery: (boolean) => 
        OBSOverlayState.setState(
            prev => ({ 
                ...prev, 
                openPreset: boolean 
        })),
    valuePresetStragery: (value) => 
        OBSOverlayState.setState(
            prev => ({ 
                ...prev, 
                valuePreset: value
        })),
})

export const OBSOverlaySettingsProps = new Store<OBSOverlaySettingsPropsType>({
  showComment: false,
  currentState: 'Đã Xác Minh',
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
      key: 'Fan Funding',
      label: 'Ủng Hộ',
      config: {
        commenter_avatar: true,
        commenter_color: '',
        commenter_effect: () => undefined,
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
    currentStateStragery: (string) => OBSOverlaySettingsProps.setState(
      prev => ({
        ...prev,
        currentState: string
      })
    ),
    showCommentStragery: (boolean) => OBSOverlaySettingsProps.setState(
      prev => ({
        ...prev,
        showComment: boolean
      })
    ),
    showAvatarStragery: (key, field, value) => {
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
    getCorrectChatTypeDataStragery: (value) => (
      OBSOverlaySettingsProps.state.ChatType.find(item => item.key === value) || null
    )
})