import type { Options } from "browser-image-compression";

import type { ChartConfig } from "@/components/ui/chart"

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

export const animationProps = {
  SuperChat: { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.9 } },
  Verified: { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.9 } },
  Normal: { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.9 } },
  Member: { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.9 } },
  Moderator: { initial: { opacity: 0, y: 30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.9 } },
}

export const headColorConfig = {
  'Doanh Thu': '',
  'Ủng Hộ': "text-[var(--chart-2)]",
  'Cửa Hàng': "text-[var(--chart-2)]",
} as const

export const chartConfig = {
  donateAmount: {
    label: "Donate",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig