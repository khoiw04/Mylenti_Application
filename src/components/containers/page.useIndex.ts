import { useEffect, useMemo } from "react"
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import { isTauri } from "@tauri-apps/api/core";
import { useRouter } from "@tanstack/react-router";
import { cancel, onUrl, start } from '@fabianlars/tauri-plugin-oauth';
import { GoogleStraregy } from "@/store"
import { useDimension } from "@/hooks/useDimension";
import { Route } from "@/routes";
import { logInWithOauthStrategy } from "@/func/fn.stragery";
import { clearGoogleOBSCookies, getTokenGoogleOBS } from "@/func/auth.googleOBS";
import { getYoutubeScopeWithURL } from "@/data/config";

function getGoogleOBSOauth() {
    const { x, y } = useDimension().dimension

    const props = useMemo(() => ({
        onGoogleLogInClick: () => {
            if (isTauri()) {
                logInWithOauthStrategy.tauriDirect(
                    getYoutubeScopeWithURL
                )
                return
            }
            
            const popup = window.open(
                getYoutubeScopeWithURL, 
                '_blank', 
                `scrollbars=yes, width=${y/2}, height=${x}, top=${x/2}, left=${y/2}`
            )
            if (popup) {
                popup.focus()
            }
        },
        onGoogleLogOutClick: async () => await clearGoogleOBSCookies()
    }), [])
    GoogleStraregy.setState((prev) => ({...prev, ...props}))
}

function handleOAuthMessage() {
    const { onFinishGoogleOBSAuth } = useStore(GoogleStraregy)
    useEffect(() => {
        function message(event: MessageEvent) {
            if (event.origin !== window.location.origin) return

            if (event.data.status === 'success') {
                toast.success('Đã thắng Đăng Nhập!')
                onFinishGoogleOBSAuth()
                return
            }

            if (event.data.status === 'error') {
                toast.error(`Đăng nhập Thất bại: ${event.data.message}`)
                return
            }
        }
        window.addEventListener('message', message)
        return () => window.removeEventListener('message', message)
    }, [])
}

function getAuthGoogleOBSCookie() {
    const { onFinishGoogleOBSAuth } = useStore(GoogleStraregy)
    const isGoogleOBSCookieAuth = Route.useLoaderData()
    useEffect(() => {isGoogleOBSCookieAuth && onFinishGoogleOBSAuth()}, [isGoogleOBSCookieAuth])
}

function useOAuthGoogleTauri() {
  const router = useRouter()
  const isGoogleOBSCookieAuth = Route.useLoaderData()
  useEffect(() => {
    let portRef: number | null = null
    if (!isGoogleOBSCookieAuth)
    try {
      (async () => {
        const port = await start({
          ports: [3001],
          response: "Qua trinh dang nhap hoan tat! Vui long dong cua so nay."
        });
        portRef = port

        await onUrl(async (redirectUrl) => {
            const urlObj = new URL(redirectUrl)
            const code = urlObj.searchParams.get('code')
            if (!code) {
                toast.error('Không lấy được code trên đường Link')
                return
            }
            await getTokenGoogleOBS({ data: { code } }),
            await Promise.all([
                cancel(port),
                router.navigate({ to: '/', reloadDocument: true })
            ])
        })
      })()
    } catch (error) {
      toast.error(`Lỗi khởi tạo OAuth server:, ${error}`);
    }
    return () => {
        if (portRef !== null) {
            cancel(portRef)
        }
    }
  }, [isGoogleOBSCookieAuth])
}

export default function useIndex() {
    getGoogleOBSOauth()
    handleOAuthMessage()
    useOAuthGoogleTauri()
    getAuthGoogleOBSCookie()
}