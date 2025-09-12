import { useEffect, useRef } from 'react'
import { useStore } from '@tanstack/react-store'
import { createTransaction, useLiveQuery } from '@tanstack/react-db'
import type { LiveChatMessageType } from '@/types'
import { chatMessageCollection } from '@/data/db.YouTubeChatCollections'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'
import { IndexState } from '@/store'

export default function usePollingYoutubeChat() {
  const { finishGoogleOBSAuth } = useStore(IndexState)
  const nextPageTokenRef = useRef('')
  const pollingIntervalRef = useRef(3000)

  const { data: messages, collection } = useLiveQuery(chatMessageCollection)

  const poll = async () => {
    const {
      messages: newMessages,
      nextPageToken,
      pollingIntervalMillis,
    }: LiveChatMessageType = await getYouTubeOBSLiveChatMessage({
      data: { nextPageToken: nextPageTokenRef.current },
    })

    nextPageTokenRef.current = nextPageToken
    pollingIntervalRef.current = pollingIntervalMillis || 3000

    const tx = createTransaction({ mutationFn: async () => {} })

    tx.mutate(() => {
      newMessages.forEach((msg) => {
        if (!collection.has(msg.id)) {
          collection.insert(msg)
        }
      })
    })

    poll()
  }

  useEffect(() => {
    if (!finishGoogleOBSAuth) return
    poll()
  }, [finishGoogleOBSAuth])

  return { messages }
}
