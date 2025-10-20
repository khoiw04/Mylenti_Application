import { useStore } from "@tanstack/react-store"
import { OBSTauriWebSocket } from "@/class/WebSocketTauriManager"
import useTauriSafeEffect from "@/hooks/useTauriSideEffect"
import { safeParse, safeSend } from "@/lib/socket.safeJSONMessage"
import { OBSOverlayTauriSettingsProps } from "@/store"
import { websocketSendType } from '@/data/settings'
import { AutoUpdateTauriManager } from "@/class/AutoUpdateTauriManager"

export default function useInitWebSocket() {
  const OBSOverlayTauriSettingsRuntime = useStore(OBSOverlayTauriSettingsProps)
  useTauriSafeEffect(() => {
    OBSTauriWebSocket.connect((msg) => {
      try {
        const parsed = safeParse<{type: string}>(msg)

        if (parsed?.type == "runtime") {
          safeSend(OBSTauriWebSocket.getSocket(), {
            type: websocketSendType.OBSSetting,
            data: OBSOverlayTauriSettingsRuntime
          })
        }

      } catch (err) {
        console.error("❌ Lỗi khi parse message:", err)
      }
    })

    return () => {
      OBSTauriWebSocket.disconnect()
    }
  }, [OBSOverlayTauriSettingsRuntime])
}

export function useAutoUpdateInit() {
  useTauriSafeEffect(() => {
      (async () => await AutoUpdateTauriManager.init())
  }, [])
}