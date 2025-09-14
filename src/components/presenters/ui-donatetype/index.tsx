// https://developer.chrome.com/blog/entry-exit-animations/

import { useStore } from "@tanstack/react-store";
import DonateComponent from "./component";
import { commentParagraphSuperchatTest, commenter_name_test, initialDonateFiles } from "@/data/obs-overlay";
import { OBSOverlaySettingsProps } from "@/store";

export default function DonateType() {
    const { currentPreset } = useStore(OBSOverlaySettingsProps)

    return (
        <DonateComponent
            srcDonateEmoji={initialDonateFiles[0].url}
            srcDonateParagraph={commentParagraphSuperchatTest}
            srcDonateComment={commenter_name_test}
            currentPreset={currentPreset}
            donatePrice="$100.00"
        />
    )
}