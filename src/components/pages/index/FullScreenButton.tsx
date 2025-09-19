import { LucideExpand } from "lucide-react";
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import ButtonFunction from './ButtonFunction'

export default function FullScreenButton() {
    return (
        <ButtonFunction
            icon={<LucideExpand />}
            description="Link Khung Chat dùng để gắn lên Browser Source"
            title="Lấy Link Khung Chat"
            onClick={async () => await writeText('http://localhost:5173/runtime/youtubelivechat')}
        />
    )
}