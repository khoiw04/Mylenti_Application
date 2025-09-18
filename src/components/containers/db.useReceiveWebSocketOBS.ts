import { useStore } from "@tanstack/react-store"
import { OBSTauriWebSocket } from "@/class/WebSocketTauriManager"
import useTauriSafeEffect from "@/hooks/useTauriSideEffect"
import { safeParse, safeSend } from "@/lib/socket.safeJSONMessage"
import { OBSOverlayTauriSettingsProps } from "@/store"
import { websocketSendType } from '@/data/settings'
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo"

export default function useReceiveWebSocket() {
  const { isAuthenticated } = useAuthInfoExternalStore()
  const OBSOverlayTauriSettingsRuntime = useStore(OBSOverlayTauriSettingsProps)
  useTauriSafeEffect(() => {
    if (!isAuthenticated) return
    OBSTauriWebSocket.connect((msg) => {
      try {
        const parsed = safeParse<{type: string}>(msg)

        if (parsed?.type == "runtime") {
          safeSend(OBSTauriWebSocket.getSocket(), {
            type: websocketSendType.OBSSetting,
            data: OBSOverlayTauriSettingsRuntime
          });
        }

      } catch (err) {
        console.error("❌ Lỗi khi parse message:", err)
      }
    })

    return () => {
      OBSTauriWebSocket.disconnect()
    }
  }, [isAuthenticated, OBSOverlayTauriSettingsRuntime])
}