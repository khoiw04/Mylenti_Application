import { createFileRoute } from '@tanstack/react-router'
import Navbar from '@/components/presenters/header/index'
import { FormFrame } from '@/components/ui/frame'
import { LogoForm } from '@/components/presenters/form'
import { ProfileForm } from '@/components/pages/ly-lich'

export const Route = createFileRoute('/ly-lich')({
  component: RouteComponent,
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