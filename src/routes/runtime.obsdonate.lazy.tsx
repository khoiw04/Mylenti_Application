import { createLazyFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import useOBSConnectWebSocket from '@/hooks/useOBSConnectWebSocket'
import OBSRuntimeDonate from '@/components/pages/runtime/obsdonate'

export const Route = createLazyFileRoute('/runtime/obsdonate')({
  component: RouteComponent
})

function RouteComponent() {
  useOBSConnectWebSocket()

  return (
    <>
      <OBSRuntimeDonate />
      <Toaster richColors expand theme='light' />
    </>
  )
}