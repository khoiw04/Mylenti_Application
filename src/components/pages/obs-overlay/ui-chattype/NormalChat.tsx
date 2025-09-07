import * as React from "react"
import {  cva } from "class-variance-authority"
import type {VariantProps} from "class-variance-authority"
import { cn } from "@/lib/utils"

const normalTypeVariants = cva("",
  {
    variants: {
      container: {
        default:
          "inline-flex gap-4 items-center",
      },
      commenter_name: {
        default: "font-extrabold",
      },
    },
    defaultVariants: {
      container: "default",
      commenter_name: "default",
    },
  }
)

function NormalType({
  className,
  container,
  commenter_name,
  showAvatar = true,
  showCommenter = true,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof normalTypeVariants> & {
    showAvatar?: boolean
    showCommenter?: boolean
  }) {
    
    const containerVarient = normalTypeVariants({ container });
    const commenterNameVariant = normalTypeVariants({ commenter_name });

    return (
        <span {...props} className={cn(containerVarient, className)}>
            {showCommenter &&
            <h2 className={cn(commenterNameVariant, className)}>
                TEST
            </h2>}
        </span>
    )
}

export { NormalType, normalTypeVariants }