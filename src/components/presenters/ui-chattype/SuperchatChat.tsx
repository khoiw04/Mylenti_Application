import * as React from "react"
import { commentVariants } from "./cva"
import { containerPriceVariants, containerSuperChatVariants, infoUserSuperchatContainerVariants } from "./cva_superchat"
import type { chatTypeVariatntsProps } from "@/types/func/returnType"
import type { chatTypeProps } from "@/types/ui/obs-overlay-setting"
import type { OBSOverlayChatKeyPropsType } from "@/types/store/obs-overlay"
import { cn, truncateMessage } from "@/lib/utils"
import { SuperchatIconStrategy } from "@/func/stragery"
import { commentParagraphSuperchatTest } from "@/data/obs-overlay"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SuperchatType({
  className,
  showAvatar = true,
  showComment = false,
  showCommenter = true,
  classNameMainContainer,
  classNameUserContainer,
  classNameCommenter,
  classNameComment,
  currentPreset,
  srcTypeMember,
  currentKeyChatType = 'Normal',
  srcAvatarCommenter = "./avatar-80-07.jpg",
  ...props
}: React.ComponentProps<"div"> &
  chatTypeVariatntsProps & 
  chatTypeProps & {
    currentKeyChatType: OBSOverlayChatKeyPropsType
  }
) {
    const containerVarient = containerSuperChatVariants({ currentPreset });
    const infoUserContainerVarient = infoUserSuperchatContainerVariants({ currentPreset });
    const containerPriceVariant = containerPriceVariants({ currentPreset });
    const commentVariant = commentVariants({ currentPreset });
    const IconComponent = currentKeyChatType === 'Normal' || currentKeyChatType === 'Superchat' ? null : 
          SuperchatIconStrategy[currentKeyChatType][currentPreset!];

    return (
      <div
        {...props} 
        className={cn(
          containerVarient,
          classNameMainContainer
        )}>
          <div className={cn(infoUserContainerVarient, classNameUserContainer)}>
            {showAvatar && IconComponent ? 
              <IconComponent
                srcAvatar={srcAvatarCommenter}
                srcTypeMember={srcTypeMember}
              /> 
              : (
              <Avatar>
                <AvatarImage src={srcAvatarCommenter} />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              )
            }
            {showCommenter &&
            <div className={cn(containerPriceVariant, classNameCommenter)}>
                <span>
                  TEST
                </span>
                <span>
                  $100.00
                </span>
            </div>}
          </div>
          <div>
            {showComment &&
              <p className={cn(commentVariant, classNameComment)}>
                {truncateMessage(commentParagraphSuperchatTest)}
              </p>
            }
          </div>
      </div>
    )
}