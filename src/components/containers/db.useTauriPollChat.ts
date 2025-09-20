import { useEffect, useRef } from 'react'
import { useStore } from '@tanstack/react-store'
import { toast } from 'sonner'
import { createOptimisticAction } from '@tanstack/db'
import type { YouTubeChatResponse } from '@/types'
import { chatTauriMessageCollection, useTauriChatMessage } from '@/data/db.YoutubeLiveChatCollections'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'
import { PollingStatusStore, PollingStatusStragery } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/socket.safeJSONMessage'
import { OBSTauriWebSocket } from '@/class/WebSocketTauriManager'

const DEFAULT_INTERVAL = 6000
const PAUSE_DURATION = 30000
const MAX_EMPTY_POLLS = 2

export default function usePollingYoutubeChat() {
  const { data: messages } = useTauriChatMessage()
  const hasPolledOnceRef = useRef(false)
  const { isError, isPaused, lastErrorMessage } = useStore(PollingStatusStore)
  const { setIsError, setIsPaused, setLastErrorMessage, setManualRetry } = useStore(PollingStatusStragery)

  const stateRef = useRef({
    nextPageToken: '',
    emptyPollCount: 0,
    pollingInterval: 0,
    timeoutId: null as NodeJS.Timeout | null,
  })

  const insertMessages = createOptimisticAction<YouTubeChatResponse['messages']>({
    onMutate: (msgs) => {
      msgs.forEach(msg => {
        chatTauriMessageCollection.utils.writeUpsert(msg)
      })
      trimCollection(23)
      safeSend(OBSTauriWebSocket.getSocket(), {
        type: websocketSendType.YouTubeMessage,
        data: msgs
      })
    },
    mutationFn: async (msgs) => {
      return null
    }
  })

  const clearTimeoutIfExists = () => {
    if (stateRef.current.timeoutId) {
      clearTimeout(stateRef.current.timeoutId)
      stateRef.current.timeoutId = null
    }
  }

  const schedulePoll = (delay: number) => {
    clearTimeoutIfExists()
    stateRef.current.timeoutId = setTimeout(executePoll, delay)
  }

  const resumePolling = () => {
    clearTimeoutIfExists()
    setIsPaused(false)
    setIsError(false)
    setLastErrorMessage('')
    stateRef.current.emptyPollCount = 0
    schedulePoll(DEFAULT_INTERVAL)
    toast.success('Đã khôi phục polling')
  }

  const handleEmptyPoll = () => {
    if (++stateRef.current.emptyPollCount >= MAX_EMPTY_POLLS) {
      setIsPaused(true)
      toast.message('⏸ Không có tin nhắn mới, tạm dừng 30 giây...')
      stateRef.current.timeoutId = setTimeout(resumePolling, PAUSE_DURATION)
    } else {
      schedulePoll(DEFAULT_INTERVAL)
    }
  }

  const executePoll = async () => {
    if (isPaused || isError) return

    try {
      const { messages: newMessages, nextPageToken, pollingIntervalMillis } = await getYouTubeOBSLiveChatMessage({
        data: { nextPageToken: stateRef.current.nextPageToken },
      })

      stateRef.current.nextPageToken = nextPageToken || ''
      stateRef.current.pollingInterval = pollingIntervalMillis || DEFAULT_INTERVAL

      const unseenMessages = newMessages.filter(msg => !chatTauriMessageCollection.has(msg.id))

      if (unseenMessages.length > 0) {
        insertMessages(unseenMessages)
        stateRef.current.emptyPollCount = 0
        schedulePoll(stateRef.current.pollingInterval)
      } else if (hasPolledOnceRef.current) {
        handleEmptyPoll()
      }

      hasPolledOnceRef.current = true
    } catch (err) {
      setIsError(true)
      setLastErrorMessage(String(err))
      toast.error(`Lỗi Polling: ${err}`)
    }
  }

  function trimCollection(limit: number = 10) {
    const syncedMap = chatTauriMessageCollection.syncedData
    const all = Array.from(syncedMap.values())
    if (all.length <= limit) return

    const sorted = all.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

    const excess = sorted.slice(limit)

    excess.forEach(msg => {
      chatTauriMessageCollection.utils.writeDelete(msg.id)
    })
  }

  useEffect(() => {
    setManualRetry(resumePolling)
  }, [])

  useEffect(() => {
    const socket = OBSTauriWebSocket.getSocket()
    if (!socket) return

    safeSend(socket, {
      type: websocketSendType.YouTubeMessage,
      data: messages
    })
  }, [])

  useEffect(() => {
    executePoll()
    return () => {
      clearTimeoutIfExists()
    }
  }, [])

  return {
    messages,
    isPaused,
    isError,
    lastErrorMessage,
    manualRetry: resumePolling
  }
}