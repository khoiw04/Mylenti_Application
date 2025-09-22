import { Store } from '@tauri-apps/plugin-store';
import type { FileWithPreview } from '@/types/func/useFileUpload';
import { APPCONFIG } from '@/data/config';

let donateFilesInstance: Store | null = null;

export const donateFiles = async (): Promise<Store> => {
  if (!donateFilesInstance) {
    donateFilesInstance = await Store.load(APPCONFIG.FILE.DONATE_FILE);
  }
  return donateFilesInstance;
};

export const saveEmojis = async (files: Array<FileWithPreview>) => {
  const store = await donateFiles();
  await store.set(APPCONFIG.FILE.EMOJI_DONATE_KEY, files);
  await store.save();
};

export const loadEmojis = async (): Promise<Array<FileWithPreview>> => {
  const store = await donateFiles();
  const data = await store.get<Array<FileWithPreview>>(APPCONFIG.FILE.EMOJI_DONATE_KEY);
  return data ?? [];
};

export const saveSounds = async (files: Array<FileWithPreview>) => {
  const store = await donateFiles();
  await store.set(APPCONFIG.FILE.SOUND_DONATE_KEY, files);
  await store.save();
};

export const loadSounds = async (): Promise<Array<FileWithPreview>> => {
  const store = await donateFiles();
  const data = await store.get<Array<FileWithPreview>>(APPCONFIG.FILE.SOUND_DONATE_KEY);
  return data ?? [];
};