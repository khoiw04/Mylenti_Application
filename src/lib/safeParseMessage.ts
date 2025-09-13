import type WebSocket from '@tauri-apps/plugin-websocket'
import type { Message } from '@tauri-apps/plugin-websocket'

export function safeParseMessage(msg: Message): unknown | null {
  if (typeof msg.data === 'string') {
    try {
      return JSON.parse(msg.data)
    } catch (err) {
      console.warn(' Không thể parse JSON:', err)
      return null
    }
  }

  console.warn(' Dữ liệu không phải chuỗi:', msg.data)
  return null
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