import * as React from "react"
import { commentVariants, commenterMainContainerVariants, commenterNameVariants, infoCommenterContainerVariants } from "./cva";
import type { chatTypeProps, chatTypeVariatntsProps } from "@/types";
import { cn, truncateMessage } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { commentParagraphTest, commenter_name_test } from "@/data/obs-overlay";

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
  srcCommentCommmenter = commentParagraphTest,
  srcNameCommenter = commenter_name_test,
  ...props
}: React.ComponentProps<"div"> & 
  chatTypeVariatntsProps & 
  chatTypeProps
) {
  const containerVarient = commenterMainContainerVariants({ currentPreset });
  const infoUserContainerVarient = infoCommenterContainerVariants({ currentPreset });
  const commenterNameVariant = commenterNameVariants({ currentPreset });
  const commentVariant = commentVariants({ currentPreset });

  return (
    <div {...props} className={cn(containerVarient, classNameMainContainer)}>
        <span className={cn(infoUserContainerVarient, classNameUserContainer)}>
          {showAvatar && (
          <Avatar className="size-6">
            <AvatarImage src={srcAvatarCommenter} />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
          )}
          {showCommenter && (
            <h2 className={cn(commenterNameVariant, classNameCommenter)}>
              {srcNameCommenter}
            </h2>
          )}
        </span>
        {showComment && (
          <p className={cn(commentVariant, classNameComment)}>
            {truncateMessage(srcCommentCommmenter)}
          </p>
        )}
    </div>
  );
}