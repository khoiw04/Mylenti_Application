import { Store } from '@tauri-apps/plugin-store';
import type { FileWithPreview } from '@/hooks/use-emoji-upload';

export const EMOJI_DONATE_FILE = 'emoji-store.json';
export const EMOJI_DONATE_KEY = 'emojis';

let storeInstance: Store | null = null;

export const getEmojis = async (): Promise<Store> => {
  if (!storeInstance) {
    storeInstance = await Store.load(EMOJI_DONATE_FILE);
  }
  return storeInstance;
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

export const clearEmojis = async () => {
  const store = await getEmojis();
  await store.set(EMOJI_DONATE_KEY, []);
  await store.save();
};