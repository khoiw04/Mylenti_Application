import { createCollection, createLiveQueryCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { ChatMessageSchemaType, LivestreamSchemaType } from '@/types/schema'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getYouTubeOBSLiveChatMessage, getYouTubeOBSLiveStreamActiveLiveChatID, getYouTubeOBSLiveStreamTitle, getYouTubeOBSLiveStreamVideoID } from '@/func/db.YouTubeChatFunc'

const { queryClient } = getContext()

export const chatMessageCollection = createCollection(
  queryCollectionOptions<ChatMessageSchemaType>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      const { messages } = await getYouTubeOBSLiveChatMessage({ data: { nextPageToken: null } })
      return messages
    },
    getKey: (item) => item.id,
    queryClient: queryClient,
    startSync: false,
    retry: 1,
    retryDelay: 10000
  })
)

export const livestreamCollection = createCollection(
  queryCollectionOptions<LivestreamSchemaType>({
    queryKey: ['livestream'],
    queryFn: async () => {
        const title = await getYouTubeOBSLiveStreamVideoID()
        const videoId = await getYouTubeOBSLiveStreamTitle()
        const liveChatId = await getYouTubeOBSLiveStreamActiveLiveChatID()

        return [
            {
                id: videoId,
                title: title,
                videoId,
                liveChatId,
                isLive: true,
            },
        ]
    },
    getKey: (item) => item.id,
    queryClient: queryClient,
  })
)

export const chatMessagesLiveQueryCollection = createLiveQueryCollection(
      (q) =>
        q.from({ liveChat: chatMessageCollection })
            .orderBy(({ liveChat }) => liveChat.publishedAt, 'desc'),
)