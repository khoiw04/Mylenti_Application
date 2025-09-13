import { createCollection, createLiveQueryCollection, useLiveQuery } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { YouTubeChatResponse } from '@/types'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'

const { queryClient } = getContext()

export const chatMessageCollection = createCollection(
  queryCollectionOptions<YouTubeChatResponse['messages'][number]>({
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
  }),
)

export const useChatMessage = () =>
  useLiveQuery((q) => q.from({ liveChat: chatMessageCollection }))

export const chatMessagesLiveQueryCollection = createLiveQueryCollection(
    (q) => q.from({ liveChat: chatMessageCollection })
)