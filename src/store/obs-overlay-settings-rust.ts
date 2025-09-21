import { Store } from '@tauri-apps/plugin-store';
import type { OBSOverlaySettingsTauriPropsType } from '@/types';
import { fallbackEmoji, fallbackSound } from '@/data/fallback';

export const OBSOVERLAY_SETTINGS_FILE = 'obs_overlay_settings-store.json';
export const OBSOVERLAY_SETTINGS_KEY = 'obs_overlay_settings';

let storeInstance: Store | null = null;

export const getOBSSetting = async (): Promise<Store> => {
    if (!storeInstance) {
        storeInstance = await Store.load(OBSOVERLAY_SETTINGS_FILE, {
            defaults: {
                obs_overlay_settings: {
                    showComment: false,
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
                }
            }
        });
    }
    return storeInstance;
};

export const saveOBSSetting = async (value: OBSOverlaySettingsTauriPropsType) => {
    const store = await getOBSSetting();
    await store.set(OBSOVERLAY_SETTINGS_KEY, value)
    await store.save();
};

export const loadOBSSetting = async () => {
    const store = await getOBSSetting();
    const data = await store.get<OBSOverlaySettingsTauriPropsType>(OBSOVERLAY_SETTINGS_KEY)
    return data ?? undefined
}

export const resetOBSSetting = async () => {
    const store = await getOBSSetting();
    await store.reset()
}