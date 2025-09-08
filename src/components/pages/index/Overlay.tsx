import { useStore } from "@tanstack/react-store";
import { useLiveQuery } from "@tanstack/react-db";
import GoogleButton from "./GoogleButton";
import { IndexState } from "@/store/index-store";
import { chatMessagesLiveQueryCollection } from "@/data/db.YouTubeChat";

export default function Overlay() {
    const { finishGoogleOBSAuth } = useStore(IndexState)

    if (!finishGoogleOBSAuth) return <GoogleButton />

    return <ChatMessages />
}

function ChatMessages() {
  const { data } = useLiveQuery(chatMessagesLiveQueryCollection)

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.message}</li>
      ))}
    </ul>
  )
}