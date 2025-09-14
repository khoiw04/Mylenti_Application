import type { VariantProps } from "class-variance-authority";
import type { commentVariants, commenterMainContainerVariants, commenterNameVariants, infoCommenterContainerVariants } from "@/components/presenters/ui-chattype/cva";
import type { donateEmojiContainerVarients, donaterCommentVariants, donaterMainContainerVariants, donaterNameVariants } from "@/components/presenters/ui-donatetype/cva";

export type commenterMainContainerVariantsProps = VariantProps<typeof commenterMainContainerVariants>;
export type commenterNameTypeVariantsProps = VariantProps<typeof commenterNameVariants>;
export type commentVariantsTypeProps = VariantProps<typeof commentVariants>;
export type infoUserContainerTypeVariantsProps = VariantProps<typeof infoCommenterContainerVariants>;

export type donaterMainContainerVariantsProps = VariantProps<typeof donaterMainContainerVariants>;
export type donaterEmojiContainerVariantsProps = VariantProps<typeof donateEmojiContainerVarients>;
export type donaterNameVariantsProps = VariantProps<typeof donaterNameVariants>;
export type donaterCommentVariantsProps = VariantProps<typeof donaterCommentVariants>;

export type chatTypeVariatntsProps = 
    commenterMainContainerVariantsProps &
    commenterNameTypeVariantsProps &
    commentVariantsTypeProps &
    infoUserContainerTypeVariantsProps

export type donateTypeVariatntsProps = 
    donaterMainContainerVariantsProps &
    donaterEmojiContainerVariantsProps &
    donaterNameVariantsProps &
    donaterCommentVariantsProps