import { LucideBadgeTurkishLira } from "lucide-react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import ButtonFunction from './ButtonFunction'
import { APPCONFIG } from "@/data/config";

export default function DonateOverlayButton() {
    return (
        <ButtonFunction
            icon={<LucideBadgeTurkishLira />}
            description="Link Donate dùng để gắn lên Browser Source"
            onClick={async () => await writeText(APPCONFIG.URL.DONATIONS_LINK)}
            title="Lấy Link Donate"
            align="start"
        />
    )
}