import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCRouter, publicProcedure } from "@/server/trpc.init";

export const trpcRouter = createTRPCRouter({
    ping: publicProcedure.query(() => {
        return "pong";
    }),

    subscribe: publicProcedure.subscription(async function* () {
        await Bun.sleep(1000);
        yield Math.random();
    }),
})
export type TRPCRouter = typeof trpcRouter
export const caller = trpcRouter.createCaller(createTRPCContext);