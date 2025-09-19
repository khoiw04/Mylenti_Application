import { LucideBadgeTurkishLira } from "lucide-react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import ButtonFunction from './ButtonFunction'

export default function DonateOverlayButton() {
    return (
        <ButtonFunction
            icon={<LucideBadgeTurkishLira />}
            description="Link Donate dùng để gắn lên Browser Source"
            onClick={async () => await writeText('http://localhost:3000/runtime/obsdonate')}
            title="Lấy Link Donate"
            align="start"
        />
    )
}