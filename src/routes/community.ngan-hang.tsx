import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import { FormFrame } from '@/components/ui/frame'
import { LogoForm } from '@/components/presenters/form'
import { BankForm } from '@/components/pages/community.ngan-hang'
import DiscordOAuthButton from '@/components/pages/community.ly-lich/DiscordOAuthButton'
import { useDiscordCommunityUser } from '@/lib/queries'

export const Route = createFileRoute('/community/ngan-hang')({
  component: RouteComponent
})

function RouteComponent() {
  const { isAuthenticated } = useDiscordCommunityUser().data
  
  return (
    <>
    <Header />
    {!isAuthenticated && <DiscordOAuthButton />}
    <FormFrame className={
      `min-h-0 bg-transparent transition-all 
      ${!isAuthenticated && 'blur'}`
    }>
      <LogoForm message='Ngân hàng' />
      <BankForm />
    </FormFrame>
    </>
  )
}