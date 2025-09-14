// https://developer.chrome.com/blog/entry-exit-animations/

import { useStore } from "@tanstack/react-store";
import DonateComponent from "./component";
import { commentParagraphSuperchatTest, commenter_name_test } from "@/data/obs-overlay";
import { OBSOverlaySettingsProps } from "@/store";

export default function DonateOverlay() {
    const { DonateProps, currentPreset } = useStore(OBSOverlaySettingsProps)

    return (
        <DonateComponent
            srcDonateEmoji={DonateProps.emojiURL[0].preview}
            srcDonateParagraph={commentParagraphSuperchatTest}
            srcDonateComment={commenter_name_test}
            currentPreset={currentPreset}
            donatePrice="$100.00"
        />
    )
}