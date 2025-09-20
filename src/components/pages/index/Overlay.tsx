import { useStore } from "@tanstack/react-store";
import GoogleLoginButton from "./GoogleLogInButton";
import { GoogleState } from "@/store";
import useIsClient from "@/hooks/useIsClient";
import ChatMessages from "@/components/presenters/YouTubeLiveChat";
import { ChatMessageTauri } from "@/components/containers/page.useChatMessages";

export default function Overlay() {
    const isClient = useIsClient()
    const { finishGoogleOBSAuth } = useStore(GoogleState)
    const { messages, showComment, currentPreset, getCorrectChatTypeDataStragery } = ChatMessageTauri()
    
    if (!isClient) return null
    if (!finishGoogleOBSAuth) return <GoogleLoginButton />

    return <ChatMessages
      messages={messages}
      config={{
        getCorrectChatTypeDataStragery,
        currentPreset,
        showComment
      }}
      className="flex flex-col absolute bottom-[2vmin] gap-1"
    />
}