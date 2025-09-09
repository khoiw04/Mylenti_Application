import { useStore } from "@tanstack/react-store";
import { LucideLogOut } from "lucide-react";
import ButtonFunction from './ButtonFunction'
import { IndexStraregy } from "@/store/index-store";
import { clearYouTubeOBSLiveStream } from "@/func/db.YouTubeChatFunc";

export default function GoogleLogOutButton() {
    const { onGoogleLogOutClick, onLogOutGoogleOBSAuth } = useStore(IndexStraregy)

    return (
        <ButtonFunction
            icon={<LucideLogOut />}
            onClick={async () => {
                await clearYouTubeOBSLiveStream()
                onGoogleLogOutClick()
                onLogOutGoogleOBSAuth()
            }}
            description="Đăng xuất vì không còn dùng tới tài khoản này nữa, hoặc muốn đổi sang tài khoản khác"
            title="Đăng Xuất với Google"
            align="end"
        />
    )
}