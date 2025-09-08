import { useStore } from "@tanstack/react-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IndexStraregy } from "@/store/index-store";

export default function GoogleButton() {
    const { onGoogleClick } = useStore(IndexStraregy)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onGoogleClick}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                        />
                    </svg>
                </Button>
            </TooltipTrigger>
            <TooltipContent className="py-3">
                <div className="space-y-2">
                    <img
                        className="w-full rounded"
                        src="https://originui.com/dialog-content.png"
                        width={382}
                        height={216}
                        alt="Content image"
                    />
                    <div className="space-y-1">
                    <p className="text-[13px] font-medium">
                        Đăng nhập với Google
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Đăng nhập để xác thực Oauth. Nhằm lấy access token và refresh token dùng để gọi YouTube API, giúp cho quá trình lấy Thông Tin Khung Chat
                    </p>
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}