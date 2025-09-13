import { useEffect, useRef } from 'react'
import WebSocket from '@tauri-apps/plugin-websocket'
import { toast } from 'sonner'
import { useStore } from '@tanstack/react-store'
import { WEBSOCKET_OBSURL } from '@/data'
import { TauriStragery } from '@/store'

export default function useWebSocketOBS() {
  const socketRef = useRef<WebSocket | null>(null)
  const { setSocket } = useStore(TauriStragery)

  const removeListenerRef = useRef<(() => void) | null>(null)

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
        setSocket(socket)

        const removeListener = socket.addListener((msg) => {
          console.log('📨 Nhận từ server:', msg.data)
        })

        removeListenerRef.current = removeListener
      } catch (err) {
        toast.error(`❌ WebSocket lỗi: ${err}`)
      }
    }

    connectWebSocket()

    return () => {
      isMounted = false

      if (removeListenerRef.current) {
        removeListenerRef.current()
        removeListenerRef.current = null
      }

      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, []) 

  return socketRef
}
