import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import Header from '@/components/presenters/header'
import Main from '@/components/pages/index'
import { getValidGoogleOBSAccessToken } from '@/func/auth.googleOBS'
import { GoogleStraregy } from '@/store'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return await getValidGoogleOBSAccessToken()
  },
})

function getAuthGoogleOBSCookie() {
    const { onFinishGoogleOBSAuth } = useStore(GoogleStraregy)
    const isGoogleOBSCookieAuth = Route.useLoaderData()
    useEffect(() => {isGoogleOBSCookieAuth && onFinishGoogleOBSAuth()}, [isGoogleOBSCookieAuth])
}

function App() {
  getAuthGoogleOBSCookie()
  return (
    <>
      <Header />
      <Main />
    </>
  )
}