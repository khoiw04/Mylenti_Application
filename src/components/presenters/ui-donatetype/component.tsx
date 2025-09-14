import { donateEmojiContainerVarients, donaterCommentVariants, donaterMainContainerVariants, donaterNameVariants } from "./cva"
import type { ComponentProps } from "react"
import type { donateTypeProps, donateTypeVariatntsProps } from "@/types"
import { commentParagraphSuperchatTest, commenter_name_test } from "@/data/obs-overlay"
import { cn } from "@/lib/utils"

export default function DonateComponent({
    srcDonateEmoji = "https://www.omocat-shop.com/cdn/shop/files/woven_spaces_1_59171a2d-dc9d-4348-97e1-4a6f4563e207_1000x.png?v=1734504476",
    srcDonateParagraph = commentParagraphSuperchatTest,
    srcDonateComment = commenter_name_test,
    classNameCommenterContainer = '',
    classNameEmojiContainer = '',
    classNameMainContainer = '',
    currentPreset = 'default',
    donatePrice = '$100.00',
    ...props
}:  donateTypeProps &
    ComponentProps<'div'> &
    donateTypeVariatntsProps
) {
    const containerVariant = donaterMainContainerVariants({ currentPreset })
    const emojiContainerVariant = donateEmojiContainerVarients({ currentPreset })
    const donateContainerVariant = donaterNameVariants({ currentPreset })
    const donateCommentVariant = donaterCommentVariants({ currentPreset })

    return (
        <div id="donateContainer" {...props} className={cn(containerVariant, classNameMainContainer)}>
            <div id="donateEmoij" className={cn(emojiContainerVariant, classNameEmojiContainer)}>
                <img
                    src={srcDonateEmoji}
                    className="absolute inset-0 object-cover"
                />
            </div>
            <h2 id="donateName" className={cn(donateContainerVariant, classNameCommenterContainer)}>
                {`${srcDonateComment} ủng hộ ${donatePrice}`}
            </h2>
            <p id="donateMessage" className={cn(donateCommentVariant, classNameCommenterContainer)}>
                {srcDonateParagraph}
            </p>
        </div>
    )
}