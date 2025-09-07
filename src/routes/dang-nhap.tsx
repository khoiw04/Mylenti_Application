import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/pages/dang-nhap'
import { Footer, LogoForm } from '@/components/presenters/form'
import { FormFrame } from '@/components/ui/frame'

export const Route = createFileRoute('/dang-nhap')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.authState.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  }
})

function RouteComponent() {
  return (
    <FormFrame
      footer={
        <div className='absolute bottom-10'>
        <Footer />
        </div>
      }
    >
      <LogoForm />
      <LoginForm />
    </FormFrame>
    )
}