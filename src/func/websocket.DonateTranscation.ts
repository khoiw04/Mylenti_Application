import { toast } from "sonner";
import type { WebSocketMessageType } from "@/types";
import type { websocketSendType } from "@/data/settings";

type DonateMessage = Extract<WebSocketMessageType, { type: typeof websocketSendType.DonateTranscation }>

export default function WebSocketDonateTranscation(
    data: DonateMessage['data']
) {
    toast.success(`${data.name} đã donate ${data.amount}`, {
      description: `Tin nhắn: ${data.message}`
    })
}