import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'
import { createTRPCClient, createWSClient, httpLink, splitLink, wsLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import type { TRPCRouter } from '@/server/tprc.router'

import { TRPCProvider } from '@/hooks/useTprcContext'

function getUrl(ws = false) {
  return ws ? 
    `ws://localhost:4455` :
    `http://localhost:4455/trpc`
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    splitLink({
        condition: (op) => op.type === "subscription",
        true: wsLink({
            client: createWSClient({
                url: getUrl(true),
            }),
            transformer: superjson,
        }),
        false: httpLink({ 
          url: getUrl(),
          transformer: superjson,
        }),
    }),
  ],
})

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  return {
    queryClient,
    trpc: serverHelpers,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  )
}
