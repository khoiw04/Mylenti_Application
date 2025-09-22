import { useStore } from "@tanstack/react-store";
import { LucideLogOut } from "lucide-react";
import ButtonFunction from './ButtonFunction'
import { GoogleStraregy } from "@/store";
import { clearYouTubeOBSLiveStream } from "@/func/db.YouTubeChatFunc";

export default function GoogleLogOutButton() {
    const { onGoogleLogOutClick, onLogOutGoogleOBSAuth } = useStore(GoogleStraregy)

    return (
        <ButtonFunction
            icon={<LucideLogOut />}
            onClick={async () => {
                await clearYouTubeOBSLiveStream()
                await onGoogleLogOutClick()
                onLogOutGoogleOBSAuth()
            }}
            description="Đăng xuất khỏi tài khoản YouTube"
            title="Đăng Xuất YouTube"
            align="end"
        />
    )
}