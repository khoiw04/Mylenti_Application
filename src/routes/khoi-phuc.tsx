import { createFileRoute, redirect } from '@tanstack/react-router'
import { LogoForm } from '@/components/presenters/form'
import { ResetForm } from '@/components/pages/khoi-phuc'
import { FormFrame } from '@/components/ui/frame'

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
            <a href="#" className="mt-1.25 inline-block">Chính sách Bảo Mật</a> và <a href="#">Điều khoản Dịch Vụ</a>.
          </div>
        </div>
      }
    >
      <LogoForm />
      <ResetForm />
    </FormFrame>
  )
}