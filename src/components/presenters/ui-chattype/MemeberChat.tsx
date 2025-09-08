import * as React from "react"
import { commentVariants, commenterNameVariants, containerMainVariants, infoUserContainerVariants } from "./cva"
import type { chatTypeVariatntsProps } from "@/types/func/returnType"
import type { chatTypeProps } from "@/types/ui/obs-overlay-setting"
import { cn, truncateMessage } from "@/lib/utils"
import { MemberIconStrategy } from "@/func/stragery"
import { commentParagraphTest } from "@/data/obs-overlay"

export default function MemeberType({
  className,
  showAvatar = true,
  showComment = false,
  showCommenter = true,
  classNameMainContainer,
  classNameUserContainer,
  classNameCommenter,
  classNameComment,
  currentPreset,
  srcTypeMember = 'https://yt3.ggpht.com/uekwnT0_9Q7maqBWXvbUa4-RpXroZyyThDwKak0rfFJW-CaMIokwDuzp5IZDsTLPS09WgF5b=s32-k-nd',
  srcAvatarCommenter = "./avatar-80-07.jpg",
  ...props
}: React.ComponentProps<"div"> &
  chatTypeVariatntsProps & 
  chatTypeProps
) {
    const containerVarient = containerMainVariants({ currentPreset, memeberPreset: currentPreset });
    const infoUserContainerVarient = infoUserContainerVariants({ currentPreset });
    const commenterNameVariant = commenterNameVariants({ currentPreset });
    const commentVariant = commentVariants({ currentPreset });
    const IconComponent = MemberIconStrategy[currentPreset!];

    return (
        <div {...props} className={cn(containerVarient, classNameMainContainer)}>
              <span className={cn(infoUserContainerVarient, classNameUserContainer)}>
                {showAvatar && IconComponent ?
                  <IconComponent
                    srcAvatar={srcAvatarCommenter}
                    srcTypeMember={srcTypeMember}
                  /> 
                  : null
                }
                {showCommenter &&
                <h2 className={cn(commenterNameVariant, classNameCommenter)}>
                  TEST
                </h2>}
              </span>
              {!showAvatar && <img src={srcTypeMember} width={22} height={22} />}
              {showComment &&
                <p className={cn(commentVariant, classNameComment)}>
                  {truncateMessage(commentParagraphTest)}
                </p>
              }
        </div>
    )
}