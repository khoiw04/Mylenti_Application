import type { OBSSetting } from "@/types";
import { OBSOverlayWebsiteSettingsStore } from "@/store";

export default function WebSocketOBSSetting(
    data: OBSSetting['data']
) {
    const current = OBSOverlayWebsiteSettingsStore.state;

    const mergedDonateProps = {
      ...current.DonateProps,
      ...data.DonateProps,
      soundURL: Array.isArray(data.DonateProps.soundURL)
        ? data.DonateProps.soundURL
        : current.DonateProps.soundURL,
      emojiURL: Array.isArray(data.DonateProps.emojiURL)
        ? data.DonateProps.emojiURL
        : current.DonateProps.emojiURL
    };

    OBSOverlayWebsiteSettingsStore.setState({
      ...data,
      DonateProps: mergedDonateProps,
    })

    console.log(OBSOverlayWebsiteSettingsStore)
}