import { initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

const t = initTRPC.context().create({
    transformer: SuperJSON,
    isServer: true
});

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure