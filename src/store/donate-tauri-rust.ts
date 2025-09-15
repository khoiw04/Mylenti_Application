import { Store } from '@tauri-apps/plugin-store';
import type { FileWithPreview } from '@/types/func/useFileUpload';

export const EMOJI_DONATE_FILE = 'emoji-store.json';
export const EMOJI_DONATE_KEY = 'emojis';

export const SOUND_DONATE_FILE = 'sound-store.json';
export const SOUND_DONATE_KEY = 'sound';

let storeEmojiInstance: Store | null = null;
let storeSoundInstance: Store | null = null;

export const getEmojis = async (): Promise<Store> => {
  if (!storeEmojiInstance) {
    storeEmojiInstance = await Store.load(EMOJI_DONATE_FILE);
  }
  return storeEmojiInstance;
};

export const saveEmojis = async (files: Array<FileWithPreview>) => {
  const store = await getEmojis();
  await store.set(EMOJI_DONATE_KEY, files);
  await store.save();
};

export const loadEmojis = async (): Promise<Array<FileWithPreview>> => {
  const store = await getEmojis();
  const data = await store.get<Array<FileWithPreview>>(EMOJI_DONATE_KEY);
  return data ?? [];
};

export const getSounds = async (): Promise<Store> => {
  if (!storeSoundInstance) {
    storeSoundInstance = await Store.load(SOUND_DONATE_FILE);
  }
  return storeSoundInstance;
};

export const saveSounds = async (files: Array<FileWithPreview>) => {
  const store = await getSounds();
  await store.set(SOUND_DONATE_KEY, files);
  await store.save();
};

export const loadSounds = async (): Promise<Array<FileWithPreview>> => {
  const store = await getSounds();
  const data = await store.get<Array<FileWithPreview>>(SOUND_DONATE_KEY);
  return data ?? [];
};