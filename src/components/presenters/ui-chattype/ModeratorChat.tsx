import * as React from "react"
import { commentVariants, commenterNameVariants, containerMainVariants, infoUserContainerVariants } from "./cva"
import type { chatTypeProps, chatTypeVariatntsProps } from "@/types"
import { cn, truncateMessage } from "@/lib/utils"
import { ModeratorIconStrategy } from "@/func/fn.stragery"
import { commentParagraphTest } from "@/data/obs-overlay"

export default function ModeratorType({
  className,
  showAvatar = true,
  showComment = false,
  showCommenter = true,
  classNameMainContainer,
  classNameUserContainer,
  classNameCommenter,
  classNameComment,
  currentPreset,
  srcAvatarCommenter = "./avatar-80-07.jpg",
  ...props
}: React.ComponentProps<"div"> &
  chatTypeVariatntsProps & 
  chatTypeProps
) {
    const containerVarient = containerMainVariants({ currentPreset });
    const infoUserContainerVarient = infoUserContainerVariants({ currentPreset });
    const commenterNameVariant = commenterNameVariants({ currentPreset });
    const commentVariant = commentVariants({ currentPreset });
    const IconComponent = ModeratorIconStrategy[currentPreset!];

    return (
        <div {...props} className={cn(containerVarient, classNameMainContainer)}>
              <span className={cn(infoUserContainerVarient, classNameUserContainer)}>
                {showAvatar && IconComponent ? <IconComponent srcAvatar={srcAvatarCommenter} /> : null}
                {showCommenter &&
                <h2 className={cn(commenterNameVariant, classNameCommenter)}>
                    TEST
                </h2>}
              </span>
              {showComment &&
                <p className={cn(commentVariant, classNameComment)}>
                  {truncateMessage(commentParagraphTest)}
                </p>
              }
        </div>
    )
}