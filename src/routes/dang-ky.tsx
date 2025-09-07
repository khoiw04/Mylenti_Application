import { createFileRoute, redirect } from '@tanstack/react-router'
import { LogupForm } from '@/components/pages/dang-ky'
import { Footer, LogoForm } from '@/components/presenters/form'
import { FormFrame } from '@/components/ui/frame'

export const Route = createFileRoute('/dang-ky')({
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
        <Footer message='ký' />
        </div>
      }
    >
      <LogoForm />
      <LogupForm />
    </FormFrame>
    )
}
