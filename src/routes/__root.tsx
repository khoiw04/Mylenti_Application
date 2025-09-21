import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'

// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { TRPCRouter } from '@/server/tprc.router'
import { authQueries, profileQueries } from '@/lib/queries'
import WindowDecorations from '@/components/presenters/window'

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
      }
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent() {
      <div>Not Found</div>
  },
  beforeLoad: async ({ context }) => {
    const authState = await context.queryClient.ensureQueryData(
      authQueries.user()
    )

    const authDiscordState = await context.queryClient.ensureQueryData(
      authQueries.discord()
    )

    return { authState, authDiscordState }
  },
  loader: async ({ context, location }) => {
    const isAuthenticated = context.authState.isAuthenticated
    const user_name_supabase = context.authState.user.meta.user_name

    const isOnInfoPage = location.pathname === '/khoi-phuc';

    if (isAuthenticated && !user_name_supabase && !isOnInfoPage) {
      throw redirect({ to: '/khoi-phuc' });
    }

    if (isAuthenticated) {
      const profile_db = await context.queryClient.ensureQueryData(
        profileQueries.user(user_name_supabase)
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
        <WindowDecorations />
        {children}
        {/* <TanstackDevtools
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
        /> */}
        <Scripts />
      </body>
    </html>
  )
}
