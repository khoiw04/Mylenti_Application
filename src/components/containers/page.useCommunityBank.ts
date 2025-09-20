import { cancel, onUrl, start } from '@fabianlars/tauri-plugin-oauth';
import { useRouter } from "@tanstack/react-router";
import { useStore } from '@tanstack/react-store';
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { isTauri } from '@tauri-apps/api/core';
import { DiscordStraregy } from '@/store';
import { clearDiscordCookies, getDiscordToken } from '@/func/auth.discord';
import { logInWithOauthStrategy } from '@/func/fn.stragery';
import { APPCONFIG } from '@/data/config';
import { useDimension } from '@/hooks/useDimension';
import { useDiscordCommunityUser } from '@/lib/queries';

function getDiscordOauth() {
    const { x, y } = useDimension().dimension

    const props = useMemo(() => ({
        onDiscordLogInClick: () => {
            if (isTauri()) {
                logInWithOauthStrategy.tauriDirect(
                    APPCONFIG.URL.DISCORD_OAUTH2
                )
                return
            }
            
            const popup = window.open(
                APPCONFIG.URL.DISCORD_OAUTH2, 
                '_blank', 
                `scrollbars=yes, width=${y/2}, height=${x}, top=${x/2}, left=${y/2}`
            )
            if (popup) {
                popup.focus()
            }
        },
        onDiscordLogOutClick: async () => await clearDiscordCookies()
    }), [])
    DiscordStraregy.setState((prev) => ({...prev, ...props}))
}

function isJoinOAuthDiscord() {
    const { onFinishDiscordOAuth } = useStore(DiscordStraregy)
    const { isAuthenticated } = useDiscordCommunityUser().data
    useEffect(() => {isAuthenticated && onFinishDiscordOAuth()}, [isAuthenticated])
}

function handleOAuthMessage() {
    const { onFinishDiscordOAuth } = useStore(DiscordStraregy)
    useEffect(() => {
        function message(event: MessageEvent) {
            if (event.origin !== window.location.origin) return

            if (event.data.status === 'success') {
                toast.success('Đã thắng Đăng Nhập!')
                onFinishDiscordOAuth()
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

function useOAuthDiscordTauri() {
  const router = useRouter()
  const { isAuthenticated } = useDiscordCommunityUser().data
  useEffect(() => {
    let portRef: number | null = null
    if (isAuthenticated) return
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
            
            try {
                await getDiscordToken({ data: { code } })
                await Promise.all([
                    cancel(port),
                    router.navigate({ to: '/community/ngan-hang', reloadDocument: true })
                ])
            } catch (err) {
                toast.error(`Lỗi xác thực Discord:, ${err}`);
            }
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
  }, [isAuthenticated])
}

export default function useCommunityBank() {
    getDiscordOauth()
    isJoinOAuthDiscord()
    handleOAuthMessage()
    useOAuthDiscordTauri()
}