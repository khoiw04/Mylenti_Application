import { createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import Header from '@/components/presenters/header'
import Main from '@/components/pages/index'
import useIndex from '@/components/containers/page.useIndex'
import { getGoogleOBSAccessToken, getGoogleOBSRefreshToken, refreshGoogleOBSToken } from '@/func/auth.googleOBS'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const access = await getGoogleOBSAccessToken()
    if (access) { return access }

    const refresh = await getGoogleOBSRefreshToken()
    if (!refresh) { return false }

    return await refreshGoogleOBSToken({ data: { refresh_token: refresh } })
  },
})

function App() {
  useIndex()
  return (
    <>
      <Header />
      <Main />
      <Toaster expand richColors theme='light' />
    </>
  )
}