import type WebSocket from '@tauri-apps/plugin-websocket'

export function safeParse<T = unknown>(msg: { type: string; data: unknown }): T | null {
  if (msg.type !== "Text") return null
  if (typeof msg.data !== "string" || msg.data.trim() === "") return null

  try {
    return JSON.parse(msg.data) as T
  } catch {
    return null
  }
}


export function safeSend(socket: WebSocket | null, payload: any) {
  if (!socket) {
    console.warn("❌ WebSocket chưa khởi tạo");
    return;
  }

  try {
    socket.send(JSON.stringify(payload));
  } catch (err) {
    console.error("❌ Gửi tin thất bại:", err);
  }
}