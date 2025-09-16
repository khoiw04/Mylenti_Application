import type { DonateMessage } from "@/types";
import { OBSOverlayDataDonateWebsiteStore } from "@/store/obs-overlay-donate-website";

export default function WebSocketDonateTranscation(
    data: DonateMessage['data']
) {
    OBSOverlayDataDonateWebsiteStore.setState(data)
}