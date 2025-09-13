import { toast } from "sonner"
import { useEffect } from "react"
import { supabaseSSR } from "@/lib/supabaseBrowser"
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo"
import useWebSocketOBS from "@/hooks/useWebSocketOBS"

export default function useListenSepayAlert() {
  const authInfo = useAuthInfoExternalStore()
  const socket = useWebSocketOBS()
  useEffect(() => {
    if (!socket.current) return

    const channel = supabaseSSR.channel(authInfo.currentUser)
      .on('broadcast', { event: 'new-transaction' }, ({ payload }) => {
        const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.transferAmount).replace(/\u00A0/g, '');

        toast.success(`${payload.donate_name} ủng hộ ${formattedAmount}`, {
          description: `Tin nhắn: ${payload.message}`
        })

        if (socket.current?.send) {
          socket.current.send(JSON.stringify({
            type: 'new-transaction',
            data: payload
          }))
        }
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
      socket.current?.disconnect()
    }
  }, [socket.current])

}