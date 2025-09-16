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
    owner: boolean
    mod: boolean
    member: boolean
    verified: boolean
  }
  message: string
  superChat: any | null
  superSticker: any | null
  publishedAt: string
}

export interface YouTubeChatResponse {
  messages: Array<FormattedChatMessage>
  nextPageToken?: string
  pollingIntervalMillis?: number
}