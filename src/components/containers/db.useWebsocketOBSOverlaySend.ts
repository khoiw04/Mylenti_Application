import { debounce } from '@tanstack/pacer'
import isEqual from "lodash/isEqual"
import { useStore } from '@tanstack/react-store'
import type { FileWithPreview } from '@/types/func/useFileUpload'
import { OBSOverlayTauriSettingsProps } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/socket.safeJSONMessage'
import { OBSTauriWebSocket } from '@/class/WebSocketTauriManager'
import useTauriSafeEffect from '@/hooks/useTauriSideEffect'

export default function useWebsocketOBSOverlaySync() {
  const OBSOverlayTauriSettingsInterval = useStore(OBSOverlayTauriSettingsProps)

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

    const unsubscribe = OBSOverlayTauriSettingsProps.subscribe(({ currentVal, prevVal }) => {
      if (isEqual(currentVal, prevVal)) return

      const cleanedDonateProps = { ...currentVal.DonateProps };

      if (isEqual(currentVal.DonateProps.emojiURL, prevVal.DonateProps.emojiURL)) {
        cleanedDonateProps.emojiURL = undefined as unknown as Array<FileWithPreview>;
      }

      if (isEqual(currentVal.DonateProps.soundURL, prevVal.DonateProps.soundURL)) {
        cleanedDonateProps.soundURL = undefined as unknown as Array<FileWithPreview>;
      }

      debouncedSend({
        ...currentVal,
        DonateProps: cleanedDonateProps,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useTauriSafeEffect(() => {
    const send = () => {
      safeSend(OBSTauriWebSocket.getSocket(), {
        type: websocketSendType.OBSSetting,
        data: OBSOverlayTauriSettingsInterval
      });
    };

    send();
    const interval = setInterval(send, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);
}