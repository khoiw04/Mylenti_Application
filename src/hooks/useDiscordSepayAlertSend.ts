import { listen } from '@tauri-apps/api/event'
import useTauriSafeEffect from './useTauriSideEffect'
import type { donateDiscordStoreRealTime } from '@/types'
import { NotificationStore } from '@/store'
import { useDiscordCommunityUser } from '@/lib/queries'
import { safeSend } from '@/lib/socket.safeJSONMessage'
import { OBSTauriWebSocket } from '@/class/WebSocketTauriManager'
import { websocketSendType } from '@/data/settings'

export default function useDiscordSepayAlertSend() {
  const { meta } = useDiscordCommunityUser().data
  useTauriSafeEffect(() => {
    if (!meta.username) return;
    let unlisten: (() => void) | null = null
    const setup = async () => {
      unlisten = await listen<donateDiscordStoreRealTime>('donate_received', ({ payload }) => {
        if (payload.user_name === meta.username) {
          const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload.transfer_amount).replace(/\u00A0/g, '');
          const newNotification = {
            id: crypto.randomUUID(),
            name: payload.display_name,
            amount: formattedAmount,
            message: payload.message,
            timestamp: new Date().toISOString(),
            unread: true
          }

          console.log('🎉 Giao dịch mới:', `${payload.display_name} ủng hộ ${formattedAmount}: ${payload.message}`)
          NotificationStore.setState((prev) => [...prev, newNotification])

          safeSend(OBSTauriWebSocket.getSocket(), {
            type: websocketSendType.DonateTranscation,
            data: {
              name: payload.display_name,
              amount: formattedAmount,
              message: payload.message
            }
          })
        }
      })
    }
    setup()
    return () => {if (unlisten) unlisten()}
  }, [meta.username])
}