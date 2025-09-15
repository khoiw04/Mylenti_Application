import { toast } from "sonner";
import type { WebSocketMessageType } from "@/types";
import type { websocketSendType } from "@/data/settings";
import { BinarytoBLOB } from "@/lib/utils";

type OBSSetting = Extract<WebSocketMessageType, { type: typeof websocketSendType.OBSSetting }>

export default function WebSocketOBSSetting(
    data: OBSSetting['data']
) {
    const soundURL = data.DonateProps.soundURL[0]
    toast.message(`📡 Server gửi: ${BinarytoBLOB(soundURL)}`)
}