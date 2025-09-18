import { AnimatePresence, motion } from "motion/react"
import type { FormattedChatMessage } from "@/types"
import type { ChatMessagesType } from "@/types/ui/ChatMessages"
import { animationProps } from "@/data/settings"
import NormalType from "@/components/presenters/ui-chattype/NormalChat"
import { ChatTypeStrategy } from "@/func/fn.stragery"

export default function ChatMessages({ config, messages, ...props }: ChatMessagesType) {
    const { currentPreset, showComment, getCorrectChatTypeDataStragery } = config
    return (
        <ul className="flex flex-col absolute bottom-[2vmin] gap-1" {...props}>
            <AnimatePresence>
            {messages.map((msg) => {
                const activeRoleEntry = Object.entries(msg.role).find(([_, value]) => value)
                const activeRole = activeRoleEntry?.[0] as keyof FormattedChatMessage['role'] | undefined

                const fallbackRole = 'Normal' as const
                const isNotOwner = activeRole && activeRole !== 'Owner'
                const ResultRole = isNotOwner ? activeRole : fallbackRole

                const YouTubeChatType = ChatTypeStrategy[ResultRole]
                const dataConfig = getCorrectChatTypeDataStragery(ResultRole)

                const animationProp = animationProps[ResultRole]

                return (
                <motion.li
                    layout
                    key={msg.id}
                    {...animationProp}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.8, 0.25, 1],
                    }}
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