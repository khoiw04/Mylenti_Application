import type { VariantProps } from "class-variance-authority";
import type { commentVariants, commenterNameVariants, containerMainVariants, infoUserContainerVariants } from "@/components/presenters/ui-chattype/cva";

export type containerTypeVariantsProps = VariantProps<typeof containerMainVariants>;
export type commenterNameTypeVariantsProps = VariantProps<typeof commenterNameVariants>;
export type commentVariantsTypeProps = VariantProps<typeof commentVariants>;
export type infoUserContainerTypeVariantsProps = VariantProps<typeof infoUserContainerVariants>;
export type chatTypeVariatntsProps = 
    containerTypeVariantsProps &
    commenterNameTypeVariantsProps &
    commentVariantsTypeProps &
    infoUserContainerTypeVariantsProps