import { OBSTauriWebSocket } from "@/class/WebSocketTauriManager"
import useTauriSafeEffect from "@/hooks/useTauriSideEffect"

export default function useReceiveWebSocket() {
  useTauriSafeEffect(() => {
    OBSTauriWebSocket.connect((_) => {})

    return () => {
      OBSTauriWebSocket.disconnect()
    }
  }, [])
}