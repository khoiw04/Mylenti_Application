import { createFileRoute, redirect } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import { removeAtPrefix } from '@/lib/utils'
import { loaderStrategy } from '@/func/fn.stragery'
import { FormFrame } from '@/components/ui/frame'
import { LogoForm } from '@/components/presenters/form'
import { BankForm } from '@/components/pages/ngan-hang'

export const Route = createFileRoute('/ngan-hang')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.authState.isAuthenticated) {
      throw redirect({ to: '/community/ngan-hang' })
    }
  },
  loader: async ({ context }) => {
    const user_name = context.authState.user.meta.user_name
    const data = await loaderStrategy.getBanksData(removeAtPrefix(user_name), context)

    if (!data) return null

    return data
  },
})

function RouteComponent() {
  return (
    <>
    <Header />
    <FormFrame className='min-h-0 bg-transparent'>
      <LogoForm message='Ngân hàng' />
      <BankForm />
    </FormFrame>
    </>
  )
}