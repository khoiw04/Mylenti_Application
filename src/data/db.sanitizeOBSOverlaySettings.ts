/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { fallbackEmoji, fallbackSound, initialDonateFiles } from './obs-overlay';
import type { OBSOverlaySettingsTauriPropsType } from '@/types';

export const sanitizeOBSOverlaySettings = (
  raw: Partial<OBSOverlaySettingsTauriPropsType>
): OBSOverlaySettingsTauriPropsType => {
  const safeDonateProps =
    typeof raw.DonateProps === 'object' && raw.DonateProps !== null
      ? raw.DonateProps
      : {} as Partial<OBSOverlaySettingsTauriPropsType['DonateProps']>;

  const safeEmojiArray = Array.isArray(safeDonateProps.emojiURL)
    ? safeDonateProps.emojiURL
    : [];

  const safeSoundArray = Array.isArray(safeDonateProps.soundURL)
    ? safeDonateProps.soundURL
    : [];

  const emojiURL =
    safeEmojiArray.length > 0
      ? safeEmojiArray.map((emoji) => ({
          name: emoji?.name ?? initialDonateFiles[0].name,
          path: emoji?.path ?? initialDonateFiles[0].url,
          preview: emoji?.preview ?? initialDonateFiles[0].url,
          type: emoji?.type ?? initialDonateFiles[0].type,
          size: emoji?.size ?? initialDonateFiles[0].size,
          binary: emoji?.binary ?? new Uint8Array(10)
        }))
      : fallbackEmoji;

  const soundURL =
    safeSoundArray.length > 0
      ? safeSoundArray.map((sound) => ({
          name: sound?.name ?? initialDonateFiles[0].name,
          path: sound?.path ?? initialDonateFiles[0].url,
          preview: sound?.preview ?? initialDonateFiles[0].url,
          type: sound?.type ?? initialDonateFiles[0].type,
          size: sound?.size ?? initialDonateFiles[0].size,
          binary: sound?.binary ?? new Uint8Array(10)
        }))
      : fallbackSound;

  const safeChatTypeArray = Array.isArray(raw.ChatType)
    ? raw.ChatType
    : [];

  return {
    showComment: raw.showComment ?? true,
    openStatePreset: raw.openStatePreset ?? false,
    currentPreset: raw.currentPreset ?? 'default',
    currentKeyChatType: raw.currentKeyChatType ?? 'Verified',
    DonateProps: {
      emojiURL,
      soundURL,
      enableVoice: safeDonateProps.enableVoice ?? false
    },
    ChatType: safeChatTypeArray.map((item) => ({
      key: item?.key ?? 'Unknown',
      label: item?.label ?? 'Không rõ',
      config: {
        commenter_avatar: item?.config?.commenter_avatar ?? true,
        commenter_color: item?.config?.commenter_color ?? '',
        commenter_effect:
          typeof item?.config?.commenter_effect === 'function'
            ? item.config.commenter_effect
            : () => undefined,
        commenter_name: item?.config?.commenter_name ?? true,
      },
    })),
  };
};