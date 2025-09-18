import { createCollection, useLiveQuery } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import type { YouTubeChatResponse } from '@/types'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'

const { queryClient } = getContext()

export const chatTauriMessageCollection = createCollection(
  queryCollectionOptions<YouTubeChatResponse['messages'][number]>({
    queryKey: ['TauriChatMessages'],
    queryFn: async () => {
      const { messages } = await getYouTubeOBSLiveChatMessage({ data: { nextPageToken: null } })
      return messages.slice(0, 23)
    },
    getKey: (item) => item.id,
    queryClient: queryClient,
    startSync: true,
    retryDelay: 10000,
    retry: 0
  }),
)

export const chatWebsiteMessageCollection = createCollection(
  queryCollectionOptions<YouTubeChatResponse['messages'][number]>({
    queryKey: ['WebsiteChatMessages'],
    queryFn: async () => {
      return []
    },
    getKey: (item) => item.id,
    queryClient: queryClient,
    startSync: true,
    retryDelay: 10000,
    retry: 0,
  })
)

export const useTauriChatMessage = () =>
  useLiveQuery((q) => q.from({ liveChat: chatTauriMessageCollection }))

export const useWebsiteChatMessage = () =>
  useLiveQuery((q) => q.from({ liveChat: chatWebsiteMessageCollection }))