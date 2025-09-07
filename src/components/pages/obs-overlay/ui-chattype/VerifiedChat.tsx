import * as React from "react"
import { commentVariants, commenterNameVariants, containerMainVariants, infoUserContainerVariants } from "./cva"
import type { chatTypeVariatntsProps } from "@/types/func/returntype"
import type { VertifedIconType } from "@/types/func/stragery"
import type { chatTypeProps } from "@/types/ui/chattype"
import { cn, truncateMessage } from "@/lib/utils"
import { VerifiedIconStrategy } from "@/func/stragery"
import { commentParagraphTest } from "@/data/obs-overlay"

function VerifiedType({
  tone,
  emphasis,
  className,
  userContainer,
  styleContainer,
  showAvatar = true,
  showComment = false,
  showCommenter = true,
  classNameMainContainer,
  classNameUserContainer,
  classNameCommenter,
  classNameComment,
  verifiedIconStyle = 'default',
  ...props
}: React.ComponentProps<"div"> &
  chatTypeVariatntsProps & 
  chatTypeProps & {
    verifiedIconStyle: VertifedIconType
  }) {    
    const containerVarient = containerMainVariants({ styleContainer });
    const userContainerVarient = infoUserContainerVariants({ userContainer });
    const commenterNameVariant = commenterNameVariants({ emphasis });
    const commentVariant = commentVariants({ tone });
    const IconComponent = VerifiedIconStrategy[verifiedIconStyle];

    return (
        <div {...props} className={cn(containerVarient, classNameMainContainer)}>
              <span className={cn(userContainerVarient, classNameUserContainer)}>
                {showAvatar && <IconComponent />}
                {showCommenter &&
                <h2 className={cn(commenterNameVariant, classNameCommenter)}>
                    TEST
                </h2>}
              </span>
              {showComment && (
                <p className={cn(commentVariant, classNameComment)}>
                  {truncateMessage(commentParagraphTest)}
                </p>
              )}
        </div>
    )
}

export { VerifiedType }