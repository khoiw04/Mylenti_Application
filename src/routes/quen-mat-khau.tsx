import { createFileRoute } from '@tanstack/react-router'
import { LogoForm } from '@/components/presenters/form'
import { FormFrame } from '@/components/ui/frame'
import { ForgetForm } from '@/components/pages/quen-mat-khau'

export const Route = createFileRoute('/quen-mat-khau')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <FormFrame>
        <LogoForm />
        <ForgetForm />
      </FormFrame>
    )
}
