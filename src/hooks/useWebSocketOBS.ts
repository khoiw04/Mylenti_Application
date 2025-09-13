import { useEffect, useRef } from 'react'
import WebSocket from '@tauri-apps/plugin-websocket'
import { toast } from 'sonner'
import { WEBSOCKET_OBSURL } from '@/data'

export default function useWebSocketOBS() {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let isMounted = true

    const connectWebSocket = async () => {
      if (socketRef.current) return
      try {
        const socket = await WebSocket.connect(WEBSOCKET_OBSURL)
        if (!isMounted) return
        socketRef.current = socket
        toast.success('WebSocket connected')
      } catch (err) {
        toast.error(`WebSocket connection failed: ${err}`)
      }
    }

    connectWebSocket()

    return () => {
      isMounted = false
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return socketRef
}