import { useStore } from "@tanstack/react-store";
import { AnimatePresence, motion } from 'motion/react'
import GoogleLoginButton from "./GoogleLogInButton";
import type { FormattedChatMessage } from "@/types";
import { IndexState, OBSOverlaySettingStragery, OBSOverlayTauriSettingsProps } from "@/store";
import useIsClient from "@/hooks/useIsClient";
import usePollingYoutubeChat from "@/components/containers/db.usePollChat";
import NormalType from "@/components/presenters/ui-chattype/NormalChat";
import { ChatTypeStrategy } from "@/func/fn.stragery";

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
  const { messages } = usePollingYoutubeChat()

  return (
      <ul className="flex flex-col absolute bottom-[2vmin] gap-1">
        <AnimatePresence mode="wait">
          {messages.map((msg) => {
            const activeRoleEntry = Object.entries(msg.role).find(([_, value]) => value)
            const activeRole = activeRoleEntry?.[0] as keyof FormattedChatMessage['role'] | undefined

            const fallbackRole = 'Normal' as const
            const isNotOwner = activeRole && activeRole !== 'Owner'
            const ResultRole = isNotOwner ? activeRole : fallbackRole

            const YouTubeChatType = ChatTypeStrategy[ResultRole]
            const dataConfig = getCorrectChatTypeDataStragery(ResultRole)

            return (
              <motion.li
                layout
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {YouTubeChatType ? 
                <YouTubeChatType 
                  author={msg.author}
                  avatar={msg.avatar}
                  comment={msg.message}
                  preset={currentPreset}
                  show_com={showComment}
                  dataConfig={dataConfig!}
                />
                :
                <NormalType 
                  srcAvatarCommenter={msg.avatar}
                  srcCommentCommmenter={msg.message}
                  srcNameCommenter={msg.author}
                  showComment={showComment}
                />
                }
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
  )
}