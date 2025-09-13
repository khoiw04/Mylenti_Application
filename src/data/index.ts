export const OAUTH_YOUTUBE_ID = `784284528195-sv4stlguipfkof39jnvl71uash2pbb8s.apps.googleusercontent.com`
export const OAUTH_YOUTUBE_SECRET = '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'
export const redirectGoogleOBSURl = `http://localhost:3000/auth/googleOBS`
export const getYoutubeScopeWithURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${OAUTH_YOUTUBE_ID}&` +
    `redirect_uri=${redirectGoogleOBSURl}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/youtube.readonly`;
export const WEBSOCKET_OBSURL = 'ws://127.0.0.1:4455'
// googleOBS_AccessToken
// googleOBS_RefreshToken