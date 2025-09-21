import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { APPCONFIG } from '@/data/config'
import { env } from '@/env/client'

function mapOAuthError(message: string) {
  if (message.includes('invalid_grant')) return 'Mã xác thực không hợp lệ hoặc đã hết hạn.'
  if (message.includes('unauthorized_client')) return 'Ứng dụng không được phép sử dụng quyền này.'
  if (message.includes('redirect_uri_mismatch')) return 'Redirect URI không khớp với cấu hình Google.'
  if (message.includes('access_denied')) return 'Bạn đã từ chối cấp quyền truy cập.'
  if (message.includes('invalid_request')) return 'Yêu cầu không hợp lệ. Vui lòng thử lại.'
  return `Lỗi không xác định: ${message}`
}

export const getTokenGoogleOBS = createServerFn({ method: 'POST' })
  .validator((d: { code: string }) => d)
  .handler(async ({ data }) => {
      const { code } = data

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            client_id: env.VITE_OAUTH_YOUTUBE_ID,
            client_secret: env.VITE_OAUTH_YOUTUBE_SERECT,
            redirect_uri: APPCONFIG.URL.REDIRECTGOOGLEOBSURL,
            grant_type: 'authorization_code',
        }),
      })

      if (!response.ok) {
          throw new Error(`Trao đổi Token Thất bại: ${response.statusText}`)
      }

      const { access_token, refresh_token, expires_in } = await response.json()

      setCookie(APPCONFIG.TOKEN.ACCESS_GOOGLE, access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: expires_in,
      })

      setCookie(APPCONFIG.TOKEN.REFRESH_GOOGLE, refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      })

      return { access_token, refresh_token, expires_in }
})

export const refreshGoogleOBSToken = createServerFn({ method: 'POST' })
  .validator((data: { refresh_token: string }) => data)
  .handler(async ({ data }) => {
    const { refresh_token } = data
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.VITE_OAUTH_YOUTUBE_ID,
        client_secret: env.VITE_OAUTH_YOUTUBE_SERECT,
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    if (!res.ok) throw new Error(`Refresh thất bại: ${res.statusText}`)

    const { access_token, expires_in } = await res.json()

    setCookie(APPCONFIG.TOKEN.ACCESS_GOOGLE, access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expires_in,
    })

    return { access_token, expires_in }
  })

export const getGoogleOBSAccessToken = createServerFn({ method: 'GET' })
  .handler(() => getCookie(APPCONFIG.TOKEN.ACCESS_GOOGLE))

export const getGoogleOBSRefreshToken = createServerFn({ method: 'GET' })
  .handler(() => getCookie(APPCONFIG.TOKEN.REFRESH_GOOGLE))

export const getValidGoogleOBSAccessToken = createServerFn({ method: 'GET' })
  .handler(async () => {
    const accessToken = await getGoogleOBSAccessToken()
    const testRes = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken)

    if (testRes.ok) {
      return accessToken
    }

    const refresh_token = await getGoogleOBSRefreshToken()
    if (!refresh_token) return null

    const { access_token } = await refreshGoogleOBSToken({ data: { refresh_token } })

    return access_token
  })

export const clearGoogleOBSCookies = createServerFn({ method: 'POST' })
  .handler(() => {
    deleteCookie(APPCONFIG.TOKEN.ACCESS_GOOGLE)
    deleteCookie(APPCONFIG.TOKEN.REFRESH_GOOGLE)

    return { status: 'success', message: 'Đã xóa cookie Google OBS' }
  })

export const exchangeCodeForGoogleOBSWebsite = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) return

  try {
    const res = await getTokenGoogleOBS({ data: { code } })
    window.opener.postMessage({ status: 'success', access_token: res.access_token }, window.location.origin)
  } catch (err: any) {
    const rawMessage = err?.message || 'Không xác định'
    const friendlyMessage = mapOAuthError(rawMessage)
    window.opener?.postMessage({ status: 'error', message: friendlyMessage }, window.location.origin)
  } finally {
    window.close()
  }
}

export const exchangeCodeForGoogleOBSTauri = async (router: any) => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) {
    router.navigate({ to: '/' })
    return
  }

  try {
    const res = await getTokenGoogleOBS({ data: { code } })
    window.opener.postMessage({ status: 'success', access_token: res.access_token }, window.location.origin)
  } catch (err: any) {
    const rawMessage = err?.message || 'Không xác định'
    const friendlyMessage = mapOAuthError(rawMessage)
    window.opener?.postMessage({ status: 'error', message: friendlyMessage }, window.location.origin)
    router.navigate({ to: '/' })
  } finally {
    router.navigate({ to: '/' })
  }
}