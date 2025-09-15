import { useEffect } from 'react'
import { toast } from 'sonner'
import { useStore } from '@tanstack/react-store'
import { debounce } from '@tanstack/pacer'
import { OBSOverlaySettingsProps, WebSocketStore } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/socket.safeJSONMessage'

export default function useWebsocketOBSOverlaySync() {
  const { socket } = useStore(WebSocketStore)

  useEffect(() => {
    const debouncedSend = debounce((data) => {
      if (!socket) {
        toast.error('Websocket Lỗi, chưa thể gửi OBS Setting')
        return
      }

      safeSend(socket, {
        type: websocketSendType.OBSSetting,
        data
      })
    }, {
      wait: 3000,
      trailing: true
    })

    const unsubscribe = OBSOverlaySettingsProps.subscribe((newState) => {
      debouncedSend(newState.currentVal)
    })

    return () => {
      unsubscribe()
    }
  }, [socket])
}
