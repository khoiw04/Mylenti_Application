import { useEffect, useRef } from 'react'
import { useStore } from '@tanstack/react-store'
import { toast } from 'sonner'
import { createOptimisticAction } from '@tanstack/db'
import type { YouTubeChatResponse } from '@/types'
import { chatMessageCollection, useChatMessage } from '@/data/db.YouTubeChatCollections'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'
import useWebSocketOBS from '@/hooks/useWebSocketOBS'
import { IndexState, PollingStatusStore, PollingStatusStragery } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/safeParseMessage'

export default function usePollingYoutubeChat() {
  const socketRef = useWebSocketOBS()
  const { finishGoogleOBSAuth } = useStore(IndexState)
  const { data: messages } = useChatMessage()

  const { isError, isPaused, lastErrorMessage } = useStore(PollingStatusStore)
  const { setIsError, setIsPaused, setLastErrorMessage, setResumePolling } = useStore(PollingStatusStragery)

  const pollingStateRef = useRef({
    nextPageToken: '',
    emptyPollCount: 0,
    POLLING_INTERVAL: 3000,
    PAUSE_DURATION: 30000,
    MAX_EMPTY_POLLS: 2,
    timeoutId: null as NodeJS.Timeout | null,
  })

  const insertMessages = createOptimisticAction<YouTubeChatResponse['messages']>({
    onMutate: (msgs) => {
      msgs.forEach(msg => {
        chatMessageCollection.insert(msg)
      })
    },
    mutationFn: async (msgs) => {
      const socket = socketRef.current
      if (!socket) {
        toast.error('WebSocket chưa kết nối, không thể gửi tin nhắn')
        return
      }

      safeSend(socket, {
        type: websocketSendType.YouTubeMessage,
        data: msgs
      })
    }
  })

  const clearCurrentTimeout = () => {
    const { timeoutId } = pollingStateRef.current
    if (timeoutId) {
      clearTimeout(timeoutId)
      pollingStateRef.current.timeoutId = null
    }
  }

  const scheduleNextPoll = (delay: number) => {
    clearCurrentTimeout()
    pollingStateRef.current.timeoutId = setTimeout(poll, delay)
  }

  const resumePolling = () => {
    clearCurrentTimeout()
    setIsPaused(false)
    setIsError(false)
    setLastErrorMessage('')
    pollingStateRef.current.emptyPollCount = 0
    scheduleNextPoll(pollingStateRef.current.POLLING_INTERVAL)
    toast.success('Đã khôi phục polling')
  }

  const poll = async () => {
    if (!finishGoogleOBSAuth || isPaused || isError) return

    try {
      const { messages: newMessages, nextPageToken, pollingIntervalMillis } = await getYouTubeOBSLiveChatMessage({
        data: { nextPageToken: pollingStateRef.current.nextPageToken },
      })

      pollingStateRef.current.nextPageToken = nextPageToken || ''
      pollingStateRef.current.POLLING_INTERVAL = pollingIntervalMillis || 3000

      const unseenMessages = newMessages.filter((msg) => !chatMessageCollection.has(msg.id))

      if (unseenMessages.length > 0) {
        insertMessages(unseenMessages)
        pollingStateRef.current.emptyPollCount = 0
        scheduleNextPoll(pollingStateRef.current.POLLING_INTERVAL)
        return
      }

      if (++pollingStateRef.current.emptyPollCount >= pollingStateRef.current.MAX_EMPTY_POLLS) {
        setIsPaused(true)
        toast.message('⏸ Không có tin nhắn mới, tạm dừng 30 giây...')
        pollingStateRef.current.timeoutId = setTimeout(resumePolling, pollingStateRef.current.PAUSE_DURATION)
        return
      }

      scheduleNextPoll(pollingStateRef.current.POLLING_INTERVAL)
    } catch (err) {
      setIsError(true)
      setLastErrorMessage(String(err))
      toast.error(`Polling error: ${err}`)
    }
  }

  useEffect(() => {
    setResumePolling(resumePolling)
  }, [])

  useEffect(() => {
    if (!finishGoogleOBSAuth) return
    poll()
    return () => {
      clearCurrentTimeout()
    }
  }, [finishGoogleOBSAuth])

  return {
    messages,
    isPaused,
    isError,
    lastErrorMessage,
    manualRetry: resumePolling
  }
}
