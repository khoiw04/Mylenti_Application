import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from 'motion/react'
import GoogleLoginButton from "./GoogleLogInButton";
import { IndexState, OBSOverlaySettingStragery, OBSOverlayTauriSettingsProps } from "@/store";
import useIsClient from "@/hooks/useIsClient";
import usePollingYoutubeChat from "@/components/containers/db.usePollChat";
import NormalType from "@/components/presenters/ui-chattype/NormalChat";

export default function Overlay() {
    const isClient = useIsClient()
    const { finishGoogleOBSAuth } = useStore(IndexState)
    
    if (!isClient) return null
    if (!finishGoogleOBSAuth) return <GoogleLoginButton />

    return <ChatMessages />
}

function ChatMessages() {
  const { showComment, currentPreset } = useStore(OBSOverlayTauriSettingsProps)
  const { getCorrectChatTypeDataStragery } = useStore(OBSOverlaySettingStragery)
  const data = getCorrectChatTypeDataStragery('Normal')
  const { messages } = usePollingYoutubeChat()

  return (
    <>
      <ul className="flex flex-col gap-1">
        <AnimatePresence mode="wait">
          {messages.map((msg) => (
            <motion.li key={msg.id}>
              <NormalType
                currentPreset={currentPreset}
                showAvatar={data?.config.commenter_avatar}
                srcCommentCommmenter={msg.message}
                srcAvatarCommenter={msg.avatar}
                srcNameCommenter={msg.author}
                showComment={showComment}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  )
}