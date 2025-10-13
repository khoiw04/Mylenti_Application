import { env } from "@/env/client"

export const APPCONFIG = {
    URL: {
        CLOUDFLARE_TUNNEL_WORKERS: 'https://create-subdomain-mylenti.khoi-w04.workers.dev',
        DISCORD_OAUTH2: 'https://discord.com/oauth2/authorize?client_id=1418751357556363416&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord&scope=identify+email',
        DISCORD_REDIRECT: 'http://localhost:3001/auth/discord',
        REDIRECTGOOGLEOBSURL: `http://localhost:3001/auth/googleOBS`,
        WEBSOCKET_OBSURL: 'ws://127.0.0.1:4455',
        REDIRECTSUPABASEOAUTHURL: 'http://localhost:3001/auth/callback',
        REDIRECTSUPABASEFORGETURL: 'http://localhost:3001/nho-mat-khau',
        REDIRECTSUPABASESIGNUPURL: 'http://localhost:3001/',
        DONATIONS_LINK: 'http://localhost:3000/runtime/obsdonate',
        APP_URL: (user_name: string) => `https://${user_name}.khoiwn04.com`
    },
    TOKEN: {
        ACCESS_DISCORD: 'discordAccessToken',
        REFRESH_DISCORD: 'discordRefreshToken',
        ACCESS_GOOGLE: 'googleOBS_AccessToken',
        REFRESH_GOOGLE: 'googleOBS_RefreshToken',
    },
    COOKIE: {
        VIDEO_ID: 'videoId',
        LIVE_CHAT_ID: 'liveChatId'
    },
    FILE: {
        TAURI_SETTING_FILE_JSON: 'settings.json',
        DONATE_FILE: 'donate-files.json',
        EMOJI_DONATE_KEY: 'emojis',
        SOUND_DONATE_KEY: 'sound',
    },
    SNAKE: {
        WEBSOCKET: 4455,
        WEBHOOK: 8080,
        GOOGLE_AUTH: 3001,
        DISCORD_AUTH: 3002,
        MAIN: 3000,
        TTS: 4545
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