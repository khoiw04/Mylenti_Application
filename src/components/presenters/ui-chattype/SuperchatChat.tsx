import * as React from "react"
import { commentVariants } from "./cva"
import { containerPriceVariants, containerSuperChatVariants, infoUserSuperchatContainerVariants } from "./cva_superchat"
import type { OBSOverlayChatKeyPropsType, chatTypeProps, chatTypeVariatntsProps } from "@/types"
import { cn, truncateMessage } from "@/lib/utils"
import { SuperchatIconStrategy } from "@/func/fn.stragery"
import { commentParagraphSuperchatTest, commenter_name_test } from "@/data/obs-overlay"
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
  srcCommentCommmenter = commentParagraphSuperchatTest,
  srcNameCommenter = commenter_name_test,
  donatePrice = '$100.00',
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
                  {srcNameCommenter}
                </span>
                <span>
                  {donatePrice}
                </span>
            </div>}
          </div>
          <div>
            {showComment &&
              <p className={cn(commentVariant, classNameComment)}>
                {truncateMessage(srcCommentCommmenter)}
              </p>
            }
          </div>
      </div>
    )
}