import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { exchangeCodeInClient } from '@/func/auth.Oauth'
import { Skeleton } from '@/components/ui/skeleton'
import Turtle from '@/components/pages/auth.callback/turtle'

export const Route = createFileRoute('/auth/callback')({
  component: RouteComponent
})

function RouteComponent() {
  useEffect(() => {
    (async () => {
      const res = await exchangeCodeInClient()

      if (res?.success) {
        await window.opener?.postMessage('oauth-success', window.location.origin)
        window.close()
      } else {
        await window.opener?.postMessage('oauth-failed', window.location.origin)
        window.close()
      }
    })()
  }, [])
  return (
    <div className='relative overflow-hidden w-full h-dvh'>
      <div className='absolute translate-x-1/2 translate-y-1/2 right-1/2 bottom-1/2'>
        <Turtle />
      </div>
      <p className='text-neutral-600 z-50 absolute text-sm bottom-30 left-1/2 -translate-x-1/2 -translate-y-1/2'>by <a href="https://uiverse.io/profile/moraxh" className='underline' target="_blank" rel="noopener noreferrer">moraxh</a></p>
      <Skeleton className='size-full bg-neutral-300' />
    </div>
  )
}