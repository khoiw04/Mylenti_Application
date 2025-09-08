import { toast } from "sonner"
import { open } from '@tauri-apps/plugin-shell'
import { getUser } from "./auth.User"
import { signInWithOauth } from "./auth.Oauth"
import { logInWithOauthStrategy } from "./stragery"
import type { OauthProps } from "@/types/func/auth"
import { isTauri } from "@/data"

async function openPopup(url: string, dimension: OauthProps['dimension']) {
  const left = dimension.y / 2 * 0.5
  const top = dimension.x / 2 * 0.5

  const features = `width=${dimension.y / 2},height=${dimension.x / 2},top=${top},left=${left},resizable=yes,scrollbars=yes`
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return isTauri ? await open(url) : window.open(url, '_blank', features)
}

export const logInWithOauth = async ({ provider, router, dimension }: OauthProps) => {
    const res = await signInWithOauth({ data: { provider } })
    if (!res.redirectUrl) {logInWithOauthStrategy.sessionFailed}

    // const popup = await openPopup(res.redirectUrl!, dimension)
    await open(res.redirectUrl!)
    // if (!popup) {logInWithOauthStrategy.popupFailed}

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