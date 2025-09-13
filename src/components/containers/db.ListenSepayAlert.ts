import { toast } from "sonner"
import { useEffect } from "react"
import { useStore } from "@tanstack/react-store"
import { supabaseSSR } from "@/lib/supabaseBrowser"
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo"
import { websocketSendType } from "@/data/settings"
import { safeSend } from "@/lib/safeParseMessage"
import { WebSocketStore } from "@/store"

export default function useListenSepayAlert() {
  const authInfo = useAuthInfoExternalStore()
  const { socket } = useStore(WebSocketStore)
  useEffect(() => {
    if (!socket) {
      toast.error('⚠️ WebSocket chưa kết nối, không thể gửi donate')
    }

    const channel = supabaseSSR.channel(authInfo.currentUser)
      .on('broadcast', { event: 'new-transaction' }, ({ payload }) => {
        const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.transferAmount).replace(/\u00A0/g, '');

        toast.success(`${payload.donate_name} ủng hộ ${formattedAmount}`, {
          description: `Tin nhắn: ${payload.message}`
        })

        safeSend(socket, {
          type: websocketSendType.DonateTranscation,
          data: {
            name: payload.donate_name,
            amount: formattedAmount,
            message: payload.message
          }
        })
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
      socket?.disconnect()
    }
  }, [socket])

}