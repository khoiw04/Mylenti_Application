import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { isTauri } from '@tauri-apps/api/core'
import { exchangeCodeForGoogleOBSTauri, exchangeCodeForGoogleOBSWebsite } from '@/func/auth.googleOBS'

export const Route = createFileRoute('/auth/googleOBS')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  useEffect(() => {
    (async () => {
      isTauri() ? 
      await exchangeCodeForGoogleOBSTauri(router)
      :
      await exchangeCodeForGoogleOBSWebsite()
    })()
  }, [])
  return null
}