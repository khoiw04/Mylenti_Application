import { debounce } from '@tanstack/pacer'
import isEqual from "lodash/isEqual"
import type { FileWithPreview } from '@/types/func/useFileUpload'
import { OBSOverlaySettingsProps } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/socket.safeJSONMessage'
import { OBSTauriWebSocket } from '@/class/WebSocketTauriManager'
import useTauriSafeEffect from '@/hooks/useTauriSideEffect'

export default function useWebsocketOBSOverlaySync() {
  useTauriSafeEffect(() => {
    const debouncedSend = debounce((data) => {
      safeSend(OBSTauriWebSocket.getSocket(), {
        type: websocketSendType.OBSSetting,
        data
      });
    }, {
      wait: 3000,
      leading: true,
      trailing: false
    });

    const unsubscribe = OBSOverlaySettingsProps.subscribe(({ currentVal, prevVal }) => {
      if (isEqual(currentVal, prevVal)) return

      const cleanedVal = {
        ...currentVal,
        DonateProps: {
          ...currentVal.DonateProps,
        },
      };

      if (isEqual(currentVal.DonateProps.emojiURL, prevVal.DonateProps.emojiURL)) {
        cleanedVal.DonateProps.emojiURL = undefined as unknown as Array<FileWithPreview>;
      }

      if (isEqual(currentVal.DonateProps.soundURL, prevVal.DonateProps.soundURL)) {
        cleanedVal.DonateProps.soundURL = undefined as unknown as Array<FileWithPreview>;
      }

      debouncedSend(cleanedVal);
    });

    return () => {
      unsubscribe();
    };
  }, []);
}