import WebSocket from "@tauri-apps/plugin-websocket";
import { toast } from "sonner";
import type { Message } from "@tauri-apps/plugin-websocket";
import { APPCONFIG } from "@/data/config";

type MessageHandler = (msg: Message) => void;

class WebSocketTauriManager {
    private socket: WebSocket | null = null
    private isConnect = false
    private reconnecterTimer: NodeJS.Timeout | null = null
    private listenerCleanup: (() => void) | null = null
    private reconnectDelay = 3000
    private clientId: string

    constructor() {
        this.clientId = typeof window !== 'undefined'
            ? localStorage.getItem('clientId') || crypto.randomUUID()
            : crypto.randomUUID();

        if (typeof window !== 'undefined') {
            localStorage.setItem('clientId', this.clientId);
        }
    }

    async connect(onMessage: MessageHandler) {
        if (this.isConnect) return

        try {
            this.socket = await WebSocket.connect(APPCONFIG.URL.WEBSOCKET_OBSURL);
            this.isConnect = true

            this.socket.send(JSON.stringify({
                type: "init",
                clientId: this.clientId
            }));

            this.listenerCleanup = this.socket.addListener((msg) => {
                onMessage(msg)
            })

        } catch (err) {
            toast.error(`Kết nối WebSocket thất bại: ${err}`)
            this.reconnecterTimer = setTimeout(() => this.connect(onMessage), this.reconnectDelay);
        }
    }

    disconnect() {
        if (this.reconnecterTimer) clearTimeout(this.reconnecterTimer);
        if (this.listenerCleanup) this.listenerCleanup();
        this.socket?.disconnect()
        this.socket = null
        this.isConnect = false
    }

    send(data: Message | string | Array<number>) {
        if (this.socket && this.isConnect) {
            this.socket.send(data)
        }
    }

    getSocket() {
        return this.socket
    }
}

export const OBSTauriWebSocket = new WebSocketTauriManager()