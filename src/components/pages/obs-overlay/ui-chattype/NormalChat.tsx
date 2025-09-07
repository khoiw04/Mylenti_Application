import * as React from "react"
import { commentVariants, commenterNameVariants, containerMainVariants, infoUserContainerVariants } from "./cva";
import type { chatTypeVariatntsProps } from "@/types/func/returntype";
import type { chatTypeProps } from "@/types/ui/chattype";
import { cn, truncateMessage } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { commentParagraphTest } from "@/data/obs-overlay";

function NormalType({
  styleContainer,
  emphasis,
  tone,
  userContainer,
  classNameMainContainer,
  classNameUserContainer,
  classNameCommenter,
  classNameComment,
  showAvatar = true,
  showCommenter = true,
  showComment = false,
  ...props
}: React.ComponentProps<"div"> & 
  chatTypeVariatntsProps & 
  chatTypeProps
) {
  const containerVarient = containerMainVariants({ styleContainer });
  const userContainerVarient = infoUserContainerVariants({ userContainer });
  const commenterNameVariant = commenterNameVariants({ emphasis });
  const commentVariant = commentVariants({ tone });

  return (
    <div {...props} className={cn(containerVarient, classNameMainContainer)}>
        <span className={cn(userContainerVarient, classNameUserContainer)}>
          {showAvatar && (
          <Avatar>
            <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
          )}
          {showCommenter && (
            <h2 className={cn(commenterNameVariant, classNameCommenter)}>TEST</h2>
          )}
        </span>
        {showComment && (
          <p className={cn(commentVariant, classNameComment)}>
            {truncateMessage(commentParagraphTest)}
          </p>
        )}
    </div>
  );
}

export { NormalType }