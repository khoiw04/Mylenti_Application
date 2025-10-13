import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { isTauri } from '@tauri-apps/api/core';
import { DiscordStraregy } from '@/store';
import { clearDiscordCookies, getDiscordToken } from '@/func/auth.discord';
import { logInWithOauthStrategy } from '@/func/fn.stragery';
import { APPCONFIG } from '@/data/config';
import { useDimension } from '@/hooks/useDimension';
import { useDiscordCommunityUser } from '@/lib/queries';
import OAuthServerManager from '@/class/OAuthServerManager';

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

function useOAuthDiscordTauri() {
  const router = useRouter()
  const { isAuthenticated } = useDiscordCommunityUser().data

  useEffect(() => {
    if (isAuthenticated) return

    const oauth = new OAuthServerManager()
    oauth.init({
      ports: [APPCONFIG.SNAKE.DISCORD_AUTH],
      response: "Qua trinh dang nhap da hoan tat. Vui long dong cua so nay!",
      onCodeReceived: async (code) => {
        await getDiscordToken({ data: { code } })
        await router.navigate({ reloadDocument: true })
      }
    }).catch((err) => {
      toast.error(`Lỗi khởi tạo OAuth server: ${err}`)
    })

    return () => {
      oauth.cleanup()
    }
  }, [isAuthenticated])
}

export default function useInitDiscordOauth() {
    getDiscordOauth()
    useOAuthDiscordTauri()
}