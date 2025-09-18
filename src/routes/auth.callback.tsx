import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { isTauri } from '@tauri-apps/api/core'
import { LoaderCircleIcon } from "lucide-react"
import { Toaster, toast } from 'sonner'
import { exchangeCodeInClient } from '@/func/auth.Oauth'
import { Skeleton } from '@/components/ui/skeleton'
import Turtle from '@/components/pages/auth.callback/turtle'
import { getUser } from '@/func/auth.User'

export const Route = createFileRoute('/auth/callback')({
  component: RouteComponent
})

function RouteComponent() {
  const router = useRouter()
  useEffect(() => {
    (async () => {
      try {
        const res = await exchangeCodeInClient()

        if (isTauri()) {
          const user = await getUser()
          if (user.isAuthenticated) {
            router.navigate({ to: '/', reloadDocument: true })
          } else {
            router.navigate({ to: '/dang-nhap' })
          }
          return
        }

        if (res?.success) {
          window.opener?.postMessage('oauth-success', window.location.origin)
        } else {
          window.opener?.postMessage('oauth-failed', window.location.origin)
        }
        window.close()
      } catch (err) {
        console.error('OAuth exchange failed:', err)
        window.opener?.postMessage('oauth-error', window.location.origin)
        if (!sessionStorage.getItem('oauth-retry')) {
          sessionStorage.setItem('oauth-retry', 'true')
          window.location.reload()
        } else {
          toast.warning('Lỗi Xác Thực! Hãy Reload để vào App')
        }
      }
    })()
  }, [])

  return (
    <div className='relative overflow-hidden w-full h-dvh'>
      {isTauri() ?
        <LoaderCircleIcon
          className="-ms-1 animate-spin size-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
          size='100%'
          strokeWidth={0.2}
        /> :
        <>
        <div className='absolute translate-x-1/2 translate-y-1/2 right-1/2 bottom-1/2'>
          <Turtle />
        </div>
        <p className='text-neutral-600 z-50 absolute text-sm bottom-30 left-1/2 -translate-x-1/2 -translate-y-1/2'>by <a href="https://uiverse.io/profile/moraxh" className='underline' target="_blank" rel="noopener noreferrer">moraxh</a></p>
        </>
      }
      <Skeleton className='size-full bg-neutral-300' />
      <Toaster expand richColors theme='light' />
    </div>
  )
}