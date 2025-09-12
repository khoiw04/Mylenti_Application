import { createCollection, createLiveQueryCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { ChatMessageSchemaType } from '@/types'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'

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
    startSync: true,
    retryDelay: 10000,
    retry: 0
  })
)

export const chatMessagesLiveQueryCollection = createLiveQueryCollection(
    (q) =>
      q.from({ liveChat: chatMessageCollection })
        .orderBy(({ liveChat }) => liveChat.publishedAt, 'desc')
)