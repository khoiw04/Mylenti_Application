import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import type { AuthDiscordState } from '@/types'
import { env } from '@/env/client'
import { APPCONFIG } from '@/data/config'
import { nativeFetch } from '@/lib/utils'

export const getDiscordToken = createServerFn({ method: 'POST' })
  .validator((d: { code: string }) => d)
  .handler(async ({ data }) => {
    const { code } = data

    const response = await nativeFetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.VITE_DISCORD_CLIENTID,
        client_secret: env.VITE_DISCORD_CLIENTSECRET,
        redirect_uri: APPCONFIG.URL.DISCORD_REDIRECT,
        grant_type: 'authorization_code',
        code,
      }),
    })

    const tokenData = await response.json()

    if (!response.ok) {
      const message = tokenData.error_description || response.statusText
      throw new Error(message)
    }

    const { access_token, refresh_token, expires_in } = tokenData

    setCookie(APPCONFIG.TOKEN.ACCESS_DISCORD, access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expires_in,
    })

    setCookie(APPCONFIG.TOKEN.REFRESH_DISCORD, refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    return { access_token, refresh_token, expires_in }
  })

export const refreshDiscordToken = createServerFn({ method: 'POST' })
  .validator((d: { refresh_token: string }) => d)
  .handler(async ({ data }) => {
    const { refresh_token } = data

    const response = await nativeFetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.VITE_DISCORD_CLIENTID,
        client_secret: env.VITE_DISCORD_CLIENTSECRET,
        grant_type: 'refresh_token',
        refresh_token,
      }),
    })

    const tokenData = await response.json()

    if (!response.ok) {
      const message = tokenData.error_description || response.statusText
      throw new Error(message)
    }

    const { access_token, expires_in } = tokenData

    setCookie(APPCONFIG.TOKEN.ACCESS_DISCORD, access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expires_in,
    })

    return { access_token, expires_in }
  })

export const getDiscordAccessToken = createServerFn({ method: 'GET' })
  .handler(() => getCookie(APPCONFIG.TOKEN.ACCESS_DISCORD))

export const getDiscordRefreshToken = createServerFn({ method: 'GET' })
  .handler(() => getCookie(APPCONFIG.TOKEN.REFRESH_DISCORD))

export const getValidDiscordAccessToken = createServerFn({ method: 'GET' })
  .handler(async () => {
    const accessToken = await getDiscordAccessToken()

    const testRes = await nativeFetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (testRes.ok) return accessToken

    const refresh_token = await getDiscordRefreshToken()
    if (!refresh_token) return null

    const { access_token } = await refreshDiscordToken({ data: { refresh_token } })

    return access_token
  })

export const clearDiscordCookies = createServerFn({ method: 'POST' })
  .handler(() => {
    deleteCookie(APPCONFIG.TOKEN.ACCESS_DISCORD)
    deleteCookie(APPCONFIG.TOKEN.REFRESH_DISCORD)

    return { status: 'success', message: 'Đã xóa cookie Discord' }
  })

export const getDiscordUserInfo = createServerFn({ method: 'GET' })
  .handler<AuthDiscordState>(async () => {
    const accessToken = await getValidDiscordAccessToken()

    if (!accessToken) {
      return {
          isAuthenticated: false,
          meta: {
            id: '',
            username: '',
            global_name: '',
            avatar: '',
            email: ''
          }
      }
    }

    const response = await nativeFetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const userData = await response.json()

    if (!response.ok) {
      return {
          isAuthenticated: false,
          meta: {
            id: '',
            username: '',
            global_name: '',
            avatar: '',
            email: ''
          }
      }
    }

    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
      : ''

    return {
      isAuthenticated: true,
      meta: {
        id: userData.id,
        username: userData.username,
        global_name: userData.global_name,
        email: userData.email,
        avatar: avatarUrl,
      }
    }
  })
