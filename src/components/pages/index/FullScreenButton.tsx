import { LucideExpand } from "lucide-react";
import ButtonFunction from './ButtonFunction'

export default function FullScreenButton() {
    return (
        <ButtonFunction
            icon={<LucideExpand />}
            description="Link Khung Chat dùng để gắn lên Browser Source"
            title="Lấy Link Khung Chat"
        />
    )
}