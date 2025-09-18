import { createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import useOBSConnectWebSocket from '@/hooks/useOBSConnectWebSocket'
import OBSRuntimeYouTube from '@/components/pages/runtime/youtubelivechat'

export const Route = createFileRoute('/runtime/youtubelivechat')({
  component: RouteComponent,
})

function RouteComponent() {
  useOBSConnectWebSocket()

  return (
    <>
      <OBSRuntimeYouTube />
      <Toaster richColors expand theme='light' />
    </>
  )
}
