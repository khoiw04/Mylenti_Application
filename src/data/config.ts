export const APPCONFIG = {
    URL: {
        DISCORD_OAUTH2: 'https://discord.com/oauth2/authorize?client_id=1418751357556363416&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord&scope=identify+email',
        DISCORD_REDIRECT: 'http://localhost:3001/auth/discord'
    },
    TOKEN: {
        ACCESS_DISCORD: 'discordAccessToken',
        REFRESH_DISCORD: 'discordRefreshToken',
    },
    SNAKE: {
        4455: 'WEBSOCKET',
        8080: 'WEBHOOK',
        3000: 'MAIN',
        4545: 'TTS'
    },
    NOTE: {
        CLOUDFLARE_TUNNEL: 'cloudflared tunnel --url http://localhost:8080'
    }
} as const