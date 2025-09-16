import { toast } from "sonner";
import type { OBSSetting } from "@/types";
import { OBSOverlaySettingsWebsiteStore } from "@/store";
import { BinarytoBLOB } from "@/lib/utils";

export default function WebSocketOBSSetting(
    data: OBSSetting['data']
) {
    const current = OBSOverlaySettingsWebsiteStore.state;

    const mergedDonateProps = {
      ...current.DonateProps,
      ...data.DonateProps,
      soundURL: data.DonateProps.soundURL.map(BinarytoBLOB),
      emojiURL: data.DonateProps.emojiURL.map(BinarytoBLOB),
    };

    OBSOverlaySettingsWebsiteStore.setState({
      ...current,
      ...data,
      DonateProps: mergedDonateProps,
    })
    toast.message(`Server gửi Blob: ${mergedDonateProps.emojiURL[0]}`)
}