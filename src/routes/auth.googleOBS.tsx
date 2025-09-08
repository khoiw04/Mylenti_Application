import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { exchangeCodeForGoogleOBS } from '@/func/auth.googleOBS'
import Turtle from '@/components/pages/auth.callback/turtle'

export const Route = createFileRoute('/auth/googleOBS')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    (async () => { await exchangeCodeForGoogleOBS()})()
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