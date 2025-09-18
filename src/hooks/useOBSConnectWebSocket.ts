import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { WebSocketMessageType } from '@/types'
import { WEBSOCKET_OBSURL } from '@/data'
import { WebSocketReceiveStrategy, messagesWebSocketLogStrategy as messageLog } from '@/func/fn.stragery'

export default function useOBSConnectWebSocket() {
    const hasConnected = useRef(false)
    const socketRef = useRef<WebSocket>(null)
    const reconnectTimer = useRef<NodeJS.Timeout>(null)
    const clientId = typeof window !== "undefined"
        ? localStorage.getItem("clientId") || crypto.randomUUID()
        : crypto.randomUUID()
    
    useEffect(() => {
        if (typeof window === "undefined") return
        if (hasConnected.current) return
        hasConnected.current = true
        localStorage.setItem("clientId", clientId)

        const connect = () => {
            const socket = new WebSocket(WEBSOCKET_OBSURL)
            socketRef.current = socket

            socket.onopen = () => {
                console.log(messageLog.success)
                toast.success(messageLog.success)

                socket.send(JSON.stringify({
                    type: "init",
                    clientId: clientId
                }));

                socket.send(JSON.stringify({
                    type: "runtime"
                }));
            }

            socket.onmessage = (event) => {
                const parsed = JSON.parse(event.data) as WebSocketMessageType
                const handler = WebSocketReceiveStrategy[parsed.type];
                if (typeof handler === "function") {
                    handler(parsed.data);
                } else {
                    console.warn(`⚠️ Không tìm thấy handler cho type: ${parsed.type}`);
                }
            }
            
            socket.onclose = () => {
                console.warn(messageLog.warn)
                toast.warning(messageLog.warn)
                reconnectTimer.current = setTimeout(connect, 3000)
            }
            
            socket.onerror = () => {
                console.error(messageLog.error)
                toast.error(messageLog.error)
                socket.close()
            }
        }

        connect()

        const handleBeforeUnload = () => {
            reconnectTimer.current && clearTimeout(reconnectTimer.current)
            socketRef.current?.close()
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload()
        }
    }, [])
}