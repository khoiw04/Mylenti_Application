import { createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import useOBSConnectWebSocket from '@/hooks/useOBSConnectWebSocket'

export const Route = createFileRoute('/runtime/obsdonate')({
  component: RouteComponent
})

function RouteComponent() {
  useOBSConnectWebSocket()

  return (
    <>
      <Toaster richColors expand theme='light' />
    </>
  )
}