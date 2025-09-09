import { LucideBadgeTurkishLira } from "lucide-react";
import ButtonFunction from './ButtonFunction'

export default function DonateOverlayButton() {
    return (
        <ButtonFunction
            icon={<LucideBadgeTurkishLira />}
            description="Link Donate dùng để gắn lên Browser Source"
            title="Lấy Link Donate"
            align="start"
        />
    )
}