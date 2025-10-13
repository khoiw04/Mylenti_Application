import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import Main from '@/components/pages/index'
import { getValidGoogleOBSAccessToken } from '@/func/auth.googleOBS'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return await getValidGoogleOBSAccessToken()
  },
})

function App() {
  return (
    <>
      <Header />
      <Main />
    </>
  )
}