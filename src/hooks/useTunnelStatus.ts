import { useMemo } from 'react'
import { toast } from 'sonner'
import { useStore } from '@tanstack/react-store';
import useSQLiteDiscordInfo from './useSQLiteDiscordInfo'
import useTauriSafeEffect from './useTauriSideEffect'
import { CloudflareController } from '@/class/CloudflareController'
import { tunnelStore } from '@/store';

export default function useTunnelStatus() {
  const { data: { user_name } } = useSQLiteDiscordInfo()
  const { status } = useStore(tunnelStore)

  useTauriSafeEffect(() => {
    if (!user_name) return
    CloudflareController.start(user_name)
  }, [user_name])

  const isRunning = useMemo(() => status === 'running', [status])
  const isStarting = useMemo(() => status === 'starting', [status])

  const toggleTunnelFn = async () => {
    if (!user_name) {
      toast.error('Không có user_name để khởi tạo tunnel')
      return
    }

    if (isRunning) {
      await CloudflareController.stop()
      toast.success('Tunnel đã Tắt!')
    } else {
      await CloudflareController.start(user_name)
      toast.success('Tunnel đã Bật!')
    }
  }

  return {
    status,
    isRunning,
    isStarting,
    toggleTunnelFn,
  }
}