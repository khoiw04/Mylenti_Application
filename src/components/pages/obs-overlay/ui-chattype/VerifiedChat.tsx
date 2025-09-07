import * as React from "react"
import {  cva } from "class-variance-authority"
import type {VariantProps} from "class-variance-authority"
import type { VerifiedIconStrategyKeyType } from "@/types/func/stragery"
import { cn } from "@/lib/utils"
import { VerifiedIconStrategy } from "@/func/stragery"

const verifiedTypeVariants = cva("",
  {
    variants: {
      container: {
        default:
          "inline-flex gap-4 items-center",
      },
      commenter_name: {
        default: "font-extrabold",
      },
      verified_icon: {
        default: null
      }
    },
    defaultVariants: {
      container: "default",
      commenter_name: "default",
      verified_icon: "default"
    },
  }
)

function VerifiedType({
  className,
  container,
  commenter_name,
  showAvatar = true,
  showCommenter = true,
  verified_icon = 'default',
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof verifiedTypeVariants> & {
    showAvatar?: boolean
    showCommenter?: boolean
  }) {
    
    const containerVarient = verifiedTypeVariants({ container });
    const commenterNameVariant = verifiedTypeVariants({ commenter_name });
    const IconComponent = VerifiedIconStrategy[verified_icon as VerifiedIconStrategyKeyType];

    return (
        <span {...props} className={cn(containerVarient, className)}>
            {showAvatar && <IconComponent />}
            {showCommenter &&
            <h2 className={cn(commenterNameVariant, className)}>
                TEST
            </h2>}
        </span>
    )
}

export { VerifiedType, verifiedTypeVariants }