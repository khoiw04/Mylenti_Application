import { useEffect, useMemo } from "react"
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import { isTauri } from "@tauri-apps/api/core";
import { IndexStraregy } from "@/store"
import { useDimension } from "@/hooks/useDimension";
import { getYoutubeScopeWithURL } from "@/data";
import { Route } from "@/routes";
import { logInWithOauthStrategy } from "@/func/fn.stragery";
import { clearGoogleOBSCookies } from "@/func/auth.googleOBS";

function getGoogleOBSOauth() {
    const { x, y } = useDimension().dimension

    const props = useMemo(() => ({
        onGoogleLogInClick: () => {
            if (isTauri()) {
                logInWithOauthStrategy.tauriDirect(
                    getYoutubeScopeWithURL
                )
            } else {
                const popup = window.open(
                    getYoutubeScopeWithURL, 
                    '_blank', 
                    `scrollbars=yes, width=${y/2}, height=${x}, top=${x/2}, left=${y/2}`
                )
                if (popup) {
                    popup.focus()
                }
            }
        },
        onGoogleLogOutClick: async () => await clearGoogleOBSCookies()
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
    const isGoogleOBSCookieAuth = Route.useLoaderData()
    useEffect(() => {isGoogleOBSCookieAuth && onFinishGoogleOBSAuth()}, [isGoogleOBSCookieAuth])
}

export default function useIndex() {
    getGoogleOBSOauth()
    handleOAuthMessage()
    getAuthGoogleOBSCookie()
}