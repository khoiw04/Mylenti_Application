import { useEffect } from 'react'
import useWebSocketOBS from '@/hooks/useWebSocketOBS'
import { OBSOverlaySettingsProps } from '@/store'

export function useOBSOverlaySync() {
  const socketRef = useWebSocketOBS()

  useEffect(() => {
    const unsubscribe = OBSOverlaySettingsProps.subscribe((newState) => {
      const socket = socketRef.current
      if (!socket) return

      socket.send(JSON.stringify({
        type: 'overlay-settings-update',
        payload: newState.currentVal
      }))
    })

    return () => {
      unsubscribe()
    }
  }, [socketRef])
}
