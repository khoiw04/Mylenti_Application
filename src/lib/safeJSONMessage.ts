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


export function safeSend(socket: WebSocket | null, data: unknown) {
  if (!socket) {
    console.warn('⚠️ WebSocket chưa kết nối')
    return
  }

  try {
    const json = JSON.stringify(data)
    if (!json || json === 'null' || json === 'undefined') {
      console.warn('⚠️ Dữ liệu không hợp lệ, không gửi:', data)
      return
    }

    socket.send(json)
    console.log('📤 Đã gửi:', json)
  } catch (err) {
    console.error('❌ Lỗi khi stringify:', err)
  }
}