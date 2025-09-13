import { useEffect } from 'react'
import { toast } from 'sonner'
import useWebSocketOBS from '@/hooks/useWebSocketOBS'
import { OBSOverlaySettingsProps } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/safeParseMessage'

export function useOBSOverlaySync() {
  const socketRef = useWebSocketOBS()

  useEffect(() => {
    const unsubscribe = OBSOverlaySettingsProps.subscribe((newState) => {
      const socket = socketRef.current
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
  }, [socketRef])
}
