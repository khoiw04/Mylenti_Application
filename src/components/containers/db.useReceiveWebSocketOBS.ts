import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useStore } from "@tanstack/react-store"
import type { WebSocketMessageType } from "@/types"
import type { FileWithPreview } from "@/types/func/useFileUpload"
import { websocketSendType } from "@/data/settings"
import { WebSocketStore } from "@/store"
import { safeParse } from "@/lib/socket.safeJSONMessage"

export default function useReceiveWebSocket() {
  const { socket } = useStore(WebSocketStore)
  const removeListenerRef = useRef<(() => void) | null>(null)

  const URLtoBLOB = (data: FileWithPreview) => {
    const blob = new Blob([data.binary], { type: data.type })
    return URL.createObjectURL(blob)
  }

  useEffect(() => {
    if (!socket) return

    const removeListener = socket.addListener((msg) => {
        const parsed = safeParse<WebSocketMessageType>(msg)
        if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return

        switch (parsed.type) {
          case websocketSendType.DonateTranscation:
            toast.success(`${parsed.data.name} đã donate ${parsed.data.amount}`, {
              description: `Tin nhắn: ${parsed.data.message}`
            })
            break

          case websocketSendType.YouTubeMessage:
            toast.message(`📡 Server gửi: ${parsed.data[0].message}`)
            break

          case websocketSendType.OBSSetting: { 
            const soundURL = parsed.data.DonateProps.soundURL[0]
            toast.message(`📡 Server gửi: ${URLtoBLOB(soundURL)}`)
            break
          }

          default:
          console.log("📦 Nhận dữ liệu không xác định:", parsed)
        }
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
