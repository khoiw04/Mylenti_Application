import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { caller } from '@/server/tprc.router';
import { useTRPCClient } from '@/hooks/useTprcContext';
import Navbar from '@/components/presenters/header/index'

export const Route = createFileRoute('/')({
  component: App,
})

async function QueryExample() {
    const data = await caller.ping();
    return <div>Ping query: {data}</div>;
}

function SubscribeExample() {
    const [number, setNumber] = useState<number>();
    const trpc = useTRPCClient()

    trpc.subscribe.subscribe(undefined, {
        onData(data) {
            setNumber(data);
        }
    });

    return <div>Subscribe: {number}</div>;
}

function App() {
  return (
    <>
    <Navbar />
    {SubscribeExample()}
    </>
  )
}
