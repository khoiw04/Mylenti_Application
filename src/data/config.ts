import { env } from "@/env/client"

export const APPCONFIG = {
    URL: {
        DISCORD_OAUTH2: 'https://discord.com/oauth2/authorize?client_id=1418751357556363416&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord&scope=identify+email',
        DISCORD_REDIRECT: 'http://localhost:3001/auth/discord',
        REDIRECTGOOGLEOBSURL: `http://localhost:3001/auth/googleOBS`,
        WEBSOCKET_OBSURL: 'ws://127.0.0.1:4455',
        REDIRECTSUPABASEOAUTHURL: 'http://localhost:3001/auth/callback',
        REDIRECTSUPABASEFORGETURL: 'http://localhost:3001/nho-mat-khau',
        REDIRECTSUPABASESIGNUPURL: 'http://localhost:3001/'
    },
    TOKEN: {
        ACCESS_DISCORD: 'discordAccessToken',
        REFRESH_DISCORD: 'discordRefreshToken',
        ACCESS_GOOGLE: 'googleOBS_AccessToken',
        REFRESH_GOOGLE: 'googleOBS_RefreshToken'
    },
    FILE: {
        TAURI_SETTING_FILE_JSON: 'settings.json',
        TAURI_SETTING_FILE_DAT: '.settings.dat',
        TAURI_USERNAME_KEY_DAT: "discord_user_name"
    },
    SNAKE: {
        4455: 'WEBSOCKET',
        8080: 'WEBHOOK',
        3001: 'AUTH',
        3000: 'MAIN',
        4545: 'TTS'
    },
    NOTE: {
        CLOUDFLARE_TUNNEL: 'cloudflared tunnel --url http://localhost:8080'
    },
    TABLE: {
        DISCORD: 'users',
        DONATE_EVENT: 'donate_events'
    }
} as const

export const getYoutubeScopeWithURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${env.VITE_OAUTH_YOUTUBE_ID}&` +
    `redirect_uri=${APPCONFIG.URL.REDIRECTGOOGLEOBSURL}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/youtube.readonly`