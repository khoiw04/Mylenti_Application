import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/presenters/header'
import Main from '@/components/pages/community.ke-toan'
import useCommunityDashboard from '@/components/containers/page.useCommunityDashboard'
import useCommunityDonate from '@/components/containers/page.useCommunityDonate'

export const Route = createFileRoute('/community/ke-toan')({
  component: RouteComponent,
})

function RouteComponent() {
  useCommunityDashboard()
  useCommunityDonate()
  return (
    <>
      <Header />
      <Main />
    </>
  )
}
