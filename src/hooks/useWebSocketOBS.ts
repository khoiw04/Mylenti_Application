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
        if (!isMounted) {
          await socket.disconnect()
          return
        }

        socketRef.current = socket
        toast.success('✅ WebSocket đã kết nối')
      } catch (err) {
        toast.error(`❌ WebSocket lỗi: ${err}`)
      }
    }

    connectWebSocket()

    return () => {
      isMounted = false
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

  return socketRef
}
