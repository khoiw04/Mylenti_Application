import { createFileRoute, redirect } from '@tanstack/react-router'
import { LogoForm } from '@/components/presenters/form'
import { ResetForm } from '@/components/pages/khoi-phuc'
import { FormFrame } from '@/components/ui/frame'
import TermOfPrivacy from '@/components/presenters/form/termofprivacy'
import TermOfService from '@/components/presenters/form/termofservice'

export const Route = createFileRoute('/khoi-phuc')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.authState.isAuthenticated || context.authState.user.meta.user_name)  {
      throw redirect({ to: '/' })
    }
  }
})

function RouteComponent() {
  return (
    <FormFrame
      footer={
        <div className='absolute bottom-10'>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Tài khoản thiếu @user_name! Cập nhật để hiển thị Tài Khoản
            <br />
            <a href="#" className="inline-block"><TermOfPrivacy /></a> và <a href="#"><TermOfService /></a>.
          </div>
        </div>
      }
    >
      <LogoForm />
      <ResetForm />
    </FormFrame>
  )
}