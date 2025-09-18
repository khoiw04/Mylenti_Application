export interface ChatAuthor {
  displayName: string
  profileImageUrl: string
  isChatModerator: boolean
  isChatOwner: boolean
  isChatSponsor: boolean
  isVerified: boolean
}

export interface ChatSnippet {
  displayMessage: string
  publishedAt: string
  superChatDetails?: any
  superStickerDetails?: any
}

export interface RawChatItem {
  id: string
  snippet: ChatSnippet
  authorDetails: ChatAuthor
}

export interface FormattedChatMessage {
  id: string
  author: string
  avatar: string
  role: {
    Owner: boolean
    Moderator: boolean
    Member: boolean
    Verified: boolean
  }
  message: string
  superChat: {
    amountMicros: number,
    currency: "USD" | "VND" | string,
    displayString: string,
    commentText: string,
    supporterDetails: {
      displayName: string,
      profileImageUrl: string,
      channelId: string,
      channelUrl: string
    },
    createdAt: string
  } | null
  superSticker: {
    stickerId: string,
    altText: string,
    language: 'en' | 'vi' | string,
    amountMicros: number,
    currency: 'USD' | 'VND' | string,
    displayString: string,
    supporterDetails: {
      displayName: string,
      profileImageUrl: string,
      channelId: string,
      channelUrl: string
    },
    createdAt: string
  } | null
  publishedAt: string
}

export interface YouTubeChatResponse {
  messages: Array<FormattedChatMessage>
  nextPageToken?: string
  pollingIntervalMillis?: number
}