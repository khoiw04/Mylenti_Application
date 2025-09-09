import { createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import Header from '@/components/presenters/header'
import { loaderStrategy } from '@/func/stragery'
import { removeAtPrefix } from '@/lib/utils'
import Main from '@/components/pages/ke-toan'
import { useDashboard } from '@/components/containers/useDashboard'
import { useDonate } from '@/components/containers/useDonate'

export const Route = createFileRoute('/ke-toan')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user_name = context.authState.user.meta.user_name
    const data = await loaderStrategy.getDonateDatabaseList(removeAtPrefix(user_name), context)

    if (!data) return null

    return data
  }
})

function RouteComponent() {
  useDashboard()
  useDonate()
  return (
    <>
      <Header />
      <Main />
      <Toaster expand richColors theme='light' />
    </>
  )
}
