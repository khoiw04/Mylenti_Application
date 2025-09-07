import { createFileRoute } from '@tanstack/react-router'
import { LogoForm } from '@/components/presenters/form'
import { RememberForm } from '@/components/pages/nho-mat-khau'
import { FormFrame } from '@/components/ui/frame'

export const Route = createFileRoute('/nho-mat-khau')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <FormFrame>
        <LogoForm />
        <RememberForm />
      </FormFrame>
    )
}