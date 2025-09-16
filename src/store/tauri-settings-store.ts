import { Store } from '@tauri-apps/plugin-store';
import { TAURI_SETTING_FILE } from '@/data';

let settingInstance: Store | null = null;

export const getSetting = async (): Promise<Store> => {
    if (!settingInstance) {
        settingInstance = await Store.load(TAURI_SETTING_FILE);
    }
    return settingInstance
}

export const loadSetting = async (key: string) => {
    const store = await getSetting();
    const data = await store.get(key);
    return data ?? []
}

export const saveSetting = async (key: string, value: string) => {
    const store = await getSetting();
    return await store.set(key, value);
}