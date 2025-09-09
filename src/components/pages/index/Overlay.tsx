import { useStore } from "@tanstack/react-store";
import GoogleLoginButton from "./GoogleLogInButton";
import { IndexState } from "@/store/index-store";
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
  const data = usePollingYoutubeChat()

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.message}</li>
      ))}
    </ul>
  )
}