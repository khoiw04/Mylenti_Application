import { useEffect } from "react"
import { toast } from "sonner"
import { useStore } from "@tanstack/react-store"
import { websocketSendType } from "@/data/settings"
import { WebSocketStore } from "@/store"

export default function useReceiveWebSocket() {
    const { socket } = useStore(WebSocketStore)

    useEffect(() => {
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