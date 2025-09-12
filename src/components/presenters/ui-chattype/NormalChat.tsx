import * as React from "react"
import { commentVariants, commenterNameVariants, containerMainVariants, infoUserContainerVariants } from "./cva";
import type { chatTypeProps, chatTypeVariatntsProps } from "@/types";
import { cn, truncateMessage } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { commentParagraphTest } from "@/data/obs-overlay";

export default function  NormalType({
  currentPreset,
  classNameComment,
  classNameMainContainer,
  classNameUserContainer,
  classNameCommenter,
  showAvatar = true,
  showCommenter = true,
  showComment = false,
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

  return (
    <div {...props} className={cn(containerVarient, classNameMainContainer)}>
        <span className={cn(infoUserContainerVarient, classNameUserContainer)}>
          {showAvatar && (
          <Avatar>
            <AvatarImage src={srcAvatarCommenter} />
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