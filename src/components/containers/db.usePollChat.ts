/* eslint-disable no-shadow */
import { useEffect, useRef } from 'react'
import { useStore } from '@tanstack/react-store'
import { createTransaction, useLiveQuery } from '@tanstack/react-db'
import { toast } from 'sonner'
import WebSocket from '@tauri-apps/plugin-websocket'
import type { YouTubeChatResponse } from '@/types';
import { chatMessageCollection } from '@/data/db.YouTubeChatCollections'
import { getYouTubeOBSLiveChatMessage } from '@/func/db.YouTubeChatFunc'
import { IndexState, OBSOverlaySettingsProps } from '@/store'
import { WEBSOCKET_OBSURL } from '@/data'

const POLLING_INTERVAL = 3000
const PAUSE_DURATION = 30000
const MAX_EMPTY_POLLS = 5

export default function usePollingYoutubeChat() {
  const { finishGoogleOBSAuth } = useStore(IndexState)
  const WEBSOCKET_OBSOverlay = useStore(OBSOverlaySettingsProps)
  const { data: messages, collection } = useLiveQuery(chatMessageCollection)

  const pollingStateRef = useRef({
    nextPageToken: '',
    emptyPollCount: 0,
    isPaused: false,
    timeoutId: null as NodeJS.Timeout | null,
  })

  const socketRef = useRef<WebSocket | null>(null)
  const isConnectedRef = useRef(false)

  const setupWebSocket = async () => {
    try {
      const socket = await WebSocket.connect(WEBSOCKET_OBSURL)
      socket.addListener((msg: any) => {
        console.log('📡 Received from OBS:', msg)
      })
      socketRef.current = socket
      isConnectedRef.current = true
      toast.success('WebSocket connected')
    } catch (err) {
      toast.error(`❌ Không thể kết nối WebSocket OBS ${err}`)
    }
  }

  const sendToWebSocket = (messages: Array<any>) => {
    const socket = socketRef.current
    if (!socket || !isConnectedRef.current) return

    socket.send(JSON.stringify({
      type: 'youtube-chat-batch',
      YOUTUBE_MESSAGE: messages,
      OBS_SETTING: WEBSOCKET_OBSOverlay
    }))
  }

  const scheduleNextPoll = (delay: number) => {
    pollingStateRef.current.timeoutId = setTimeout(poll, delay)
  }

  const cancelScheduledPoll = () => {
    const { timeoutId } = pollingStateRef.current
    if (timeoutId) {
      clearTimeout(timeoutId)
      pollingStateRef.current.timeoutId = null
    }
  }

  const insertMessages = (rawMessages: YouTubeChatResponse['messages']) => {
    const tx = createTransaction({ mutationFn: async () => {} })

    tx.mutate(() => {
      rawMessages.forEach((msg) => {
        if (!collection.has(msg.id)) {
          collection.insert(msg)
        }
      })
    })

    sendToWebSocket(rawMessages)
  }

  const poll = async () => {
    const state = pollingStateRef.current
    if (!finishGoogleOBSAuth || state.isPaused) return

    try {
      const { messages: newMessages, nextPageToken } = await getYouTubeOBSLiveChatMessage({
        data: { nextPageToken: state.nextPageToken },
      })

      state.nextPageToken = nextPageToken || ''

      const unseenMessages = newMessages.filter((msg) => !collection.has(msg.id))

      if (unseenMessages.length > 0) {
        insertMessages(unseenMessages)
        state.emptyPollCount = 0
      } else if (++state.emptyPollCount >= MAX_EMPTY_POLLS) {
        state.isPaused = true
        toast.message('⏸ Không có tin nhắn mới, tạm dừng 30 giây...')
        setTimeout(() => {
          state.emptyPollCount = 0
          state.isPaused = false
          poll()
        }, PAUSE_DURATION)
        return
      }
    } catch (err) {
      toast.error(`Polling error: ${err}`)
    }

    scheduleNextPoll(POLLING_INTERVAL)
  }

  useEffect(() => {
    if (!finishGoogleOBSAuth) return

    setupWebSocket()
    poll()

    return () => {
      cancelScheduledPoll()
    }
  }, [finishGoogleOBSAuth])

  return { messages }
}
