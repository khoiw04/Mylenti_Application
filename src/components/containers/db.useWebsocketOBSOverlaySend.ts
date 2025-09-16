import { useEffect } from 'react'
import { debounce } from '@tanstack/pacer'
import { OBSOverlaySettingsProps } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/socket.safeJSONMessage'
import { OBSTauriWebSocket } from '@/class/WebSocketTauriManager'

export default function useWebsocketOBSOverlaySync() {

  useEffect(() => {
    const debouncedSend = debounce((data) => {
      safeSend(OBSTauriWebSocket.getSocket(), {
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
  }, [])
}
