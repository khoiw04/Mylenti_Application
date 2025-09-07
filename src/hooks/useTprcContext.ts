import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { TRPCRouter } from '@/server/tprc.router'

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<TRPCRouter>()