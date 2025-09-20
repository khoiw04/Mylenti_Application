import { toast } from "sonner"
import { isTauri } from "@tauri-apps/api/core"
import { getUser } from "./auth.SupabaseUser"
import { signInWithOauth } from "./auth.SupabaseOauth"
import { logInWithOauthStrategy } from "./fn.stragery"
import type { OauthProps } from "@/types"

function openPopup(url: string, dimension: OauthProps['dimension']) {
  const left = dimension.y / 2 * 0.5
  const top = dimension.x / 2 * 0.5

  const features = `width=${dimension.y / 2},height=${dimension.x / 2},top=${top},left=${left},resizable=yes,scrollbars=yes`
  return window.open(url, '_blank', features)
}

export const logInWithOauth = async ({ provider, router, dimension }: OauthProps) => {
    const res = await signInWithOauth({ data: { provider } })
    if (!res.redirectUrl) {logInWithOauthStrategy.sessionFailed}

    if (isTauri()) {
      logInWithOauthStrategy.tauriDirect(res.redirectUrl!)
    } else {
      const popup = openPopup(res.redirectUrl!, dimension);
      if (!popup) logInWithOauthStrategy.popupFailed;
    }

    window.addEventListener('message', async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data === 'oauth-success') {

        const user = await getUser()
        if (user.isAuthenticated) {
          toast.success('Đã thắng Đăng nhập', {
            onAutoClose() {router.navigate({ to: '/', reloadDocument: true })},
            onDismiss() {router.navigate({ to: '/', reloadDocument: true })}
          })
        } else {
          toast.error('Đăng nhập thất bại')
        }

      } else if (event.data === 'oauth-failed') {
          toast.error('Đăng nhập thất bại')
      }
    })
}