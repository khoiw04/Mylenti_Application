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
    return loaderStrategy.getDonateList(removeAtPrefix(user_name), context)
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
