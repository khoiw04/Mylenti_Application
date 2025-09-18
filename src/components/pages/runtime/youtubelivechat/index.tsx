import { ChatMessageWebsite } from "@/components/containers/page.useChatMessages";
import ChatMessages from "@/components/presenters/YouTubeLiveChat";

export default function OBSYouTube() {
  const { currentPreset, getCorrectChatTypeDataStragery, messages, showComment } = ChatMessageWebsite()
  return <ChatMessages 
      messages={messages}
      config={{
        showComment,
        currentPreset,
        getCorrectChatTypeDataStragery
      }}
      className="flex flex-col gap-1 justify-end items-start max-w-lg h-dvh"
    />
}