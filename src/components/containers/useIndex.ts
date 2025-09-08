import { useEffect, useMemo } from "react"
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import { IndexStraregy } from "@/store/index-store"
import { useDimension } from "@/func/useDimension";
import { OAUTH_YOUTUBE_ID, redirectGoogleOBSURl } from "@/data";
import { Route } from "@/routes";

function getGoogleOBSOauth() {
    const { x, y } = useDimension().dimension

    const linkGoogle = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${OAUTH_YOUTUBE_ID}&` +
        `redirect_uri=${redirectGoogleOBSURl}&` +
        `response_type=code&` +
        `scope=https://www.googleapis.com/auth/youtube.readonly`;

    const props = useMemo(() => ({
        onGoogleClick: () => {
            const popup = window.open(
                linkGoogle, 
                '_blank', 
                `scrollbars=yes, width=${y/2}, height=${x}, top=${x/2}, left=${y/2}`
            )
            if (popup) {
                popup.focus()
            }
        }
    }), [])

    IndexStraregy.setState((prev) => ({...prev, ...props}))
}

function handleOAuthMessage() {
    const { onFinishGoogleOBSAuth } = useStore(IndexStraregy)
    useEffect(() => {
        function message(event: MessageEvent) {
            if (event.origin !== window.location.origin) return

            if (event.data.status === 'success') {
                toast.success('Đã thắng Đăng Nhập!')
                onFinishGoogleOBSAuth()
            } else if (event.data.status === 'error') {
                toast.error(`Đăng nhập Thất bại: ${event.data.message}`)
            }
        }

        window.addEventListener('message', message)
        return () => window.removeEventListener('message', message)
    }, [])
}

function getAuthGoogleOBSCookie() {
    const { onFinishGoogleOBSAuth } = useStore(IndexStraregy)
    const isAuth = Route.useLoaderData()

    useEffect(() => {
        if (isAuth) {
            onFinishGoogleOBSAuth()
        }
    }, [isAuth])
}

export default function useIndex() {
    getGoogleOBSOauth()
    handleOAuthMessage()
    getAuthGoogleOBSCookie()
}