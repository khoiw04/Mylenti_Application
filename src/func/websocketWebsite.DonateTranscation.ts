import { toast } from "sonner";
import type { DonateMessage } from "@/types";
import { OBSOVerlaySettingsDonateWebsiteStore } from "@/store/obs-overlay-donate-website";

export default function WebSocketDonateTranscation(
    data: DonateMessage['data']
) {
    OBSOVerlaySettingsDonateWebsiteStore.setState({
      amount: data.amount,
      message: data.message,
      name: data.name
    })

    toast.success(`${data.name} đã donate ${data.amount}`, {
      description: `Tin nhắn: ${data.message}`
    })
}