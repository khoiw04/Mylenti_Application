import { supabaseSSR } from "@/lib/supabaseBrowser"
import { websocketSendType } from "@/data/settings"
import { safeSend } from "@/lib/socket.safeJSONMessage"
import { OBSTauriWebSocket } from "@/class/WebSocketTauriManager"
import useAuthInfo from "@/hooks/useAuthSupabaseInfo"
import useTauriSafeEffect from "@/hooks/useTauriSideEffect"
import { NotificationStore } from "@/store"

export default function useWebSocketSepayAlertSend() {
  const authInfo = useAuthInfo()

  useTauriSafeEffect(() => {
    const channel = supabaseSSR.channel(authInfo.currentUser)
      .on('broadcast', { event: 'new-transaction' }, ({ payload }) => {
        const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.transferAmount).replace(/\u00A0/g, '');

        const newNotification = {
          id: crypto.randomUUID(),
          name: payload.donate_name,
          amount: formattedAmount,
          message: payload.message,
          timestamp: new Date().toISOString(),
          unread: true
        }

        NotificationStore.setState((prev) => [...prev, newNotification])

        safeSend(OBSTauriWebSocket.getSocket(), {
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
    }
  }, [])
}