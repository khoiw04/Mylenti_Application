import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import Main from '@/components/pages/obs-overlay'

export const Route = createFileRoute('/obs-overlay')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Main />
    </>
  )
}
