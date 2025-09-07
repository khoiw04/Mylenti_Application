import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { TRPCRouter } from '@/server/tprc.router'
import { authQueries, profileQueries } from '@/lib/queries'

interface MyRouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  beforeLoad: async ({ context }) => {
    const authState = await context.queryClient.ensureQueryData(
      authQueries.user()
    )

    return { authState }
  },
  loader: async ({ context, location }) => {
    const isAuthenticated = context.authState.isAuthenticated
    const user_name = context.authState.user.meta.user_name

    const isOnInfoPage = location.pathname === '/khoi-phuc';
    const isOnLoginPage = ['/dang-nhap', '/dang-ky', '/quen-mat-khau', '/nho-mat-khau', '/auth/callback'].includes(location.pathname);

    if (isAuthenticated && !user_name && !isOnInfoPage) {
      throw redirect({ to: '/khoi-phuc' });
    }

    if (!isAuthenticated && !isOnLoginPage) {
      throw redirect({ to: '/dang-nhap' })
    }

    if (isAuthenticated) {
      const profile_db = await context.queryClient.ensureQueryData(
        profileQueries.user(user_name)
      )

      return { profile_db }
    }
  }
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
