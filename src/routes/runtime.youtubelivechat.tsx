import { createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'

export const Route = createFileRoute('/runtime/youtubelivechat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Toaster richColors expand theme='light' />
  )
}
