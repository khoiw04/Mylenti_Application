import { Store } from "@tanstack/store";
import type WebSocket from "@tauri-apps/plugin-websocket";
import type { Window } from "@tauri-apps/api/window";

export const AppWindowStore = new Store<{
    appWindow: Window | null
}>({
    appWindow: null
})

export const WebSocketStore = new Store<{
    socket: WebSocket | null
}>({
    socket: null
})

export const TauriStragery = new Store({
    setSocket: (socket: WebSocket | null) =>
        WebSocketStore.setState({ socket })
})