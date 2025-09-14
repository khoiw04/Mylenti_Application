import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useStore } from "@tanstack/react-store"
import { readFile } from '@tauri-apps/plugin-fs';
import type { WebSocketMessageType } from "@/types"
import { websocketSendType } from "@/data/settings"
import { WebSocketStore } from "@/store"
import { safeParse } from "@/lib/socket.safeJSONMessage"

// **
// Cách gửi ảnh Path sang OBS OVERLAY qua Mã Nhị Phân
//
// const sendEmojiToOBS = async () => {
//   const settings = OBSOverlaySettingsProps.get();
//   const paths = settings.DonateProps.emojiPath ?? [];

//   for (const path of paths) {
//      const buffer = await readFile(path);
//      socket.send(JSON.stringify({
//      type: 'emoji',
//      name: 'kirby.gif',
//      mime: 'image/gif',
//      data: Array.from(buffer),
//    }));
//   }
// };

export default function useReceiveWebSocket() {
  const { socket } = useStore(WebSocketStore)
  const removeListenerRef = useRef<(() => void) | null>(null)

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
