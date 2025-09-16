import type { WebSocketMessageType } from "@/types"
import { safeParse } from "@/lib/socket.safeJSONMessage"
import { WebSocketSendStrategy } from "@/func/fn.stragery"
import { OBSTauriWebSocket } from "@/class/WebSocketTauriManager"
import useTauriSafeEffect from "@/hooks/useTauriSideEffect"

export default function useReceiveWebSocket() {
  useTauriSafeEffect(() => {
    OBSTauriWebSocket.connect((msg) => {
        const parsed = safeParse<WebSocketMessageType>(msg)
        if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return

        const handler = WebSocketSendStrategy[parsed.type]

        if (typeof handler === "function") {
            handler(parsed.data)
        }
    })

    return () => {
      OBSTauriWebSocket.disconnect()
    }
  }, [])
}