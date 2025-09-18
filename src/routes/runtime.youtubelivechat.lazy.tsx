import { createLazyFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import useOBSConnectWebSocket from '@/hooks/useOBSConnectWebSocket'
import OBSRuntimeYouTube from '@/components/pages/runtime/youtubelivechat'

export const Route = createLazyFileRoute('/runtime/youtubelivechat')({
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