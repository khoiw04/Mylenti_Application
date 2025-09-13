import { useEffect } from "react"
import { toast } from "sonner"
import useWebSocketOBS from "@/hooks/useWebSocketOBS"
import { websocketSendType } from "@/data/settings"

export default function useReceiveWebSocket() {
    const socketRef = useWebSocketOBS()

    useEffect(() => {
        const socket = socketRef.current

        socket?.addListener((msg) => {
            const data = msg

            toast.success(`${data.name} đã donate ${data.amount} VND`, {
                description: `Tin nhắn: ${data.message}`
            })

            if (data && typeof data === 'object' && 'type' in data) {
                switch (data.type) {
                case websocketSendType.DonateTranscation:
                    toast.success(`${data.name} đã donate ${data.amount} VND`, {
                        description: `Tin nhắn: ${data.message}`
                    })
                    break

                case websocketSendType.YouTubeMessage:
                    toast.message(`📡 Server gửi: ${data.type}`)
                    break

                default:
                    console.log('📦 Nhận dữ liệu không xác định:', data)
                }
            }
        })

        return () => {
            socket?.disconnect()
        }
    }, [])
}