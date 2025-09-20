import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import { FormFrame } from '@/components/ui/frame'
import { LogoForm } from '@/components/presenters/form'
import { ProfileForm } from '@/components/pages/community.ly-lich'
import useCommunityProfile from '@/components/containers/page.useCommunityProfile'
import DiscordOAuthButton from '@/components/pages/community.ly-lich/DiscordOAuthButton'
import { useDiscordCommunityUser } from '@/lib/queries'

export const Route = createFileRoute('/community/ly-lich')({
  component: RouteComponent
})

function RouteComponent() {
  useCommunityProfile()
  const { isAuthenticated } = useDiscordCommunityUser().data
  return (
    <>
    <Header />
    {!isAuthenticated && <DiscordOAuthButton />}
    <FormFrame className={
      `min-h-0 bg-transparent transition-all 
      ${!isAuthenticated && 'blur'}`
    }>
      <LogoForm message='Lý lịch' />
      <ProfileForm />
    </FormFrame>
    </>
  )
}