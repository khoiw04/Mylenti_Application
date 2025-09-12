import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import GoogleLoginButton from "./GoogleLogInButton";
import { IndexState } from "@/store";
import useIsClient from "@/hooks/useIsClient";
import usePollingYoutubeChat from "@/components/containers/db.usePollChat";

export default function Overlay() {
    const isClient = useIsClient()
    const { finishGoogleOBSAuth } = useStore(IndexState)
    
    if (!isClient) return null
    if (!finishGoogleOBSAuth) return <GoogleLoginButton />

    return <ChatMessages />
}

function ChatMessages() {
  const { messages } = usePollingYoutubeChat()
  useEffect(() => {
    console.log(messages)
  }, [messages])
  return (
    <>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.author}: {msg.message}</li>
        ))}
      </ul>
    </>
  )
}