import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import Main from '@/components/pages/index'
import useIndex from '@/components/containers/page.useIndex'
import { getValidGoogleOBSAccessToken } from '@/func/auth.googleOBS'

export const Route = createFileRoute('/main')({
  component: App,
  loader: async () => {
    return await getValidGoogleOBSAccessToken()
  },
})

function App() {
  useIndex()
  return (
    <>
      <Header />
      <Main />
    </>
  )
}