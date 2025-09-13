import { useEffect } from 'react'
import { toast } from 'sonner'
import { useStore } from '@tanstack/react-store'
import { OBSOverlaySettingsProps, WebSocketStore } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/safeJSONMessage'

export function useOBSOverlaySync() {
  const { socket } = useStore(WebSocketStore)

  useEffect(() => {
    const unsubscribe = OBSOverlaySettingsProps.subscribe((newState) => {
      if (!socket) {
        toast.error('Websocket Lỗi, chưa thể gửi OBS Setting')
        return
      }

      safeSend(socket, {
        type: websocketSendType.OBSSetting,
        data: newState.currentVal
      })
    })

    return () => {
      unsubscribe()
    }
  }, [socket])
}
