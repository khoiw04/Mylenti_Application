import { useEffect, useRef } from "react"
import { useStore } from "@tanstack/react-store"
import type { WebSocketMessageType } from "@/types"
import { WebSocketStore } from "@/store"
import { safeParse } from "@/lib/socket.safeJSONMessage"
import { WebSocketSendStrategy } from "@/func/fn.stragery"

export default function useReceiveWebSocket() {
  const { socket } = useStore(WebSocketStore)
  const removeListenerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!socket) return

    const removeListener = socket.addListener((msg) => {
        const parsed = safeParse<WebSocketMessageType>(msg)
        if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return

        WebSocketSendStrategy[parsed.type]
    })

    removeListenerRef.current = removeListener

    return () => {
      if (removeListenerRef.current) {
        removeListenerRef.current()
        removeListenerRef.current = null
      }
    }
  }, [socket])
}