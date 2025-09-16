import type { Options } from "browser-image-compression";

export const bannedWords = ['chửi', 'tục', 'đ.m', 'vãi', 'lồn', 'địt', 'spam', 'xxx']

export const postCompression: Options = {
    maxSizeMB: 3,
    maxWidthOrHeight: 1080,
    useWebWorker: false
}

export const avatarCompression: Options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 560,
    useWebWorker: false
}

export type dayKeyType = keyof typeof daysMap
export const daysMap = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '180d': 180,
    '360d': 360
}

export const websocketSendType = {
    DonateTranscation: 'new-transaction',
    OBSSetting: 'overlay-settings-update',
    YouTubeMessage: 'live-chat-message'
} as const