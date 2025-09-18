import { useEffect, useRef } from 'react'
import { useStore } from '@tanstack/react-store'
import { toast } from 'sonner'
import { createOptimisticAction } from '@tanstack/db'
import type { YouTubeChatResponse } from '@/types'
import { chatTauriMessageCollection, useTauriChatMessage } from '@/data/db.YouTubeChatCollections'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'
import { IndexState, PollingStatusStore, PollingStatusStragery } from '@/store'
import { websocketSendType } from '@/data/settings'
import { safeSend } from '@/lib/socket.safeJSONMessage'
import { OBSTauriWebSocket } from '@/class/WebSocketTauriManager'

const DEFAULT_INTERVAL = 3000
const PAUSE_DURATION = 30000
const MAX_EMPTY_POLLS = 2

export default function usePollingYoutubeChat() {
  const { finishGoogleOBSAuth } = useStore(IndexState)
  const { data: messages } = useTauriChatMessage()
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
    },
    mutationFn: async () => {
      safeSend(OBSTauriWebSocket.getSocket(), {
        type: websocketSendType.YouTubeMessage,
        data: messages
      })
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
    if (!finishGoogleOBSAuth || isPaused || isError) return

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
      } else {
        handleEmptyPoll()
      }
    } catch (err) {
      setIsError(true)
      setLastErrorMessage(String(err))
      toast.error(`Lỗi Polling: ${err}`)
    }
  }

  useEffect(() => {
    setManualRetry(resumePolling)
  }, [])

  useEffect(() => {
    if (!finishGoogleOBSAuth) return
    executePoll()
    return () => {
      clearTimeoutIfExists()
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