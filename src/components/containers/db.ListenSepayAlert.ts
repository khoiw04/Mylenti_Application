import { toast } from "sonner"
import { useEffect } from "react"
import { supabaseSSR } from "@/lib/supabaseBrowser"
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo"
import useWebSocketOBS from "@/hooks/useWebSocketOBS"
import { websocketSendType } from "@/data/settings"
import { safeSend } from "@/lib/safeParseMessage"

export default function useListenSepayAlert() {
  const authInfo = useAuthInfoExternalStore()
  const socket = useWebSocketOBS()
  useEffect(() => {
    if (!socket.current) {
      toast.error('⚠️ WebSocket chưa kết nối, không thể gửi donate')
    }

    const channel = supabaseSSR.channel(authInfo.currentUser)
      .on('broadcast', { event: 'new-transaction' }, ({ payload }) => {
        const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.transferAmount).replace(/\u00A0/g, '');

        toast.success(`${payload.donate_name} ủng hộ ${formattedAmount}`, {
          description: `Tin nhắn: ${payload.message}`
        })

        safeSend(socket.current, {
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
      socket.current?.disconnect()
    }
  }, [socket.current])

}