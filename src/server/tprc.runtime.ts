import { createBunWSHandler } from 'trpc-bun-adapter';
import { trpcRouter } from './tprc.router';

console.log("Building client...");
Bun.spawnSync(["bun", "bundle"]);

const websocket = createBunWSHandler({
    router: trpcRouter,
    onError: console.error,
    batching: {
        enabled: true,
    },
    keepAlive: {
        enabled: true,
        pingMs: 400,
        pongWaitMs: 5000,
    },
});

Bun.serve({
    port: 3001,
    fetch(request, server) {
        if (server.upgrade(request, {data: {req: request}})) {
            return;
        }

        return new Response("Please use websocket protocol", {status: 404});
    },
    websocket,
});