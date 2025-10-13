import { useEffect, useMemo } from "react"
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import { isTauri } from "@tauri-apps/api/core";
import { useRouter } from "@tanstack/react-router";
import { GoogleState, GoogleStraregy } from "@/store"
import { useDimension } from "@/hooks/useDimension";
import { logInWithOauthStrategy } from "@/func/fn.stragery";
import { clearGoogleOBSCookies, getTokenGoogleOBS } from "@/func/auth.googleOBS";
import { APPCONFIG, getYoutubeScopeWithURL } from "@/data/config";
import OAuthServerManager from "@/class/OAuthServerManager";

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

function useOAuthGoogleTauri() {
  const router = useRouter()
  const { finishGoogleOBSAuth } = useStore(GoogleState)
  useEffect(() => {
    const oauth = new OAuthServerManager()
    if (!finishGoogleOBSAuth)
    
    oauth.init({
      ports: [APPCONFIG.SNAKE.GOOGLE_AUTH],
      response: "Qua trinh dang nhap da hoan tat. Vui long dong cua so nay!",
      onCodeReceived: async (code) => {
        await getTokenGoogleOBS({ data: { code } }),
        await router.navigate({ reloadDocument: true })
      }
    }).catch((err) => {
      toast.error(`Lỗi khởi tạo OAuth server: ${err}`)
    })

    return () => {
      oauth.cleanup()
    }
  }, [finishGoogleOBSAuth])
}

export default function useInitGoogleOauth() {
    getGoogleOBSOauth()
    handleOAuthMessage()
    useOAuthGoogleTauri()
}