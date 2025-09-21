import { createFileRoute, redirect } from '@tanstack/react-router'
import Navbar from '@/components/presenters/header/index'
import { FormFrame } from '@/components/ui/frame'
import { LogoForm } from '@/components/presenters/form'
import { ProfileForm } from '@/components/pages/ly-lich'

export const Route = createFileRoute('/ly-lich')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.authState.isAuthenticated) 
      throw redirect({ to: '/community/ly-lich' })
  }
})

function RouteComponent() {
  return (
    <>
    <Navbar/>
    <FormFrame className='min-h-0 bg-transparent'>
      <LogoForm message='Lý lịch' />
      <ProfileForm />
    </FormFrame>
    </>
  )
}