/* eslint-disable no-shadow */
import { createServerFn } from '@tanstack/react-start'
import { getValidGoogleOBSAccessToken } from './auth.googleOBS'
import type { YouTubeChatResponse } from '@/types'
import { clearCachedCookie, getCachedCookie, nativeFetch, setCachedCookie } from '@/lib/utils'
import { APPCONFIG } from '@/data/config'

export const clearYouTubeOBSLiveStream = createServerFn()
  .handler(async () => {
    await clearCachedCookie({ data: { key: APPCONFIG.COOKIE.VIDEO_ID }})
    await clearCachedCookie({ data: { key: APPCONFIG.COOKIE.LIVE_CHAT_ID }})
  })

export const getYouTubeOBSVideoId = createServerFn({ method: 'GET' })
  .validator((d: { useVideoIDCached: boolean }) => d)
  .handler(async ({ data: { useVideoIDCached } }) => {
    const cachedVideoId = await getCachedCookie({ data: { key: APPCONFIG.COOKIE.VIDEO_ID } })
    if (cachedVideoId && useVideoIDCached) {
      return cachedVideoId
    }

    const accessToken = await getValidGoogleOBSAccessToken()

    const response = await nativeFetch(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,contentDetails,status&broadcastStatus=active`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    )

    const result = await response.json()
    const items = result.items

    if (!items || items.length === 0) {
      throw new Error(JSON.stringify(result, null, 2))
    }

    const liveVideo = items.find((item: any) => item?.id)
    if (!liveVideo) {
      throw new Error('Không tìm thấy video livestream hợp lệ')
    }

    const videoId = liveVideo.id
    await setCachedCookie({
      data: {
        key: APPCONFIG.COOKIE.VIDEO_ID,
        value: videoId,
        maxAge: 3 * 60 * 60 * 1000,
      },
    })

    return videoId
  })

export const getYouTubeOBSLiveStreamActiveLiveChatID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const cached = await getCachedCookie({data: { key: APPCONFIG.COOKIE.LIVE_CHAT_ID }})
        if (cached) return cached

        const accessToken = await getValidGoogleOBSAccessToken()
        const videoId = await getYouTubeOBSVideoId({ data: { useVideoIDCached: true } })

        async function getLiveChatIdFromVideo(videoId: string, accessToken: string) {
          const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          })

          const data = await res.json()
          return data.items?.[0]?.liveStreamingDetails?.activeLiveChatId ?? null
        }
        let liveChatId = await getLiveChatIdFromVideo(videoId, accessToken)
        if (!liveChatId) {
            const newVideoId = await getYouTubeOBSVideoId({ data: { useVideoIDCached: false } })
            liveChatId = await getLiveChatIdFromVideo(newVideoId, accessToken)

            if (!liveChatId) {
              throw new Error('Livestream không có live chat đang hoạt động')
            }
        }

        await setCachedCookie({data : {key: APPCONFIG.COOKIE.LIVE_CHAT_ID, value: liveChatId, maxAge: 1000 * 60 * 60 * 6}})
        return liveChatId
    })

export const getYouTubeOBSLiveChatMessage = createServerFn({ method: 'GET' })
  .validator((d: { nextPageToken: string | null }) => d)
  .handler<YouTubeChatResponse>(async ({ data: { nextPageToken } }) => {
    const accessToken = await getValidGoogleOBSAccessToken()
    const liveChatId = await getYouTubeOBSLiveStreamActiveLiveChatID()

    const url = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages')
    url.searchParams.set(APPCONFIG.COOKIE.LIVE_CHAT_ID, liveChatId)
    url.searchParams.set('part', 'snippet,authorDetails')
    url.searchParams.set('fields', `
      items(
        id,
        snippet(displayMessage,publishedAt,superChatDetails,superStickerDetails),
        authorDetails(
          displayName,
          profileImageUrl,
          isChatModerator,
          isChatOwner,
          isChatSponsor,
          isVerified
        )
      ),
      nextPageToken,
      pollingIntervalMillis
    `.replace(/\s+/g, ''))
    if (nextPageToken) {
      url.searchParams.set('pageToken', nextPageToken)
    }

    const res = await nativeFetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()

    if (!data.items) {
      throw new Error(JSON.stringify(data, null, 2))
    }

    return {
      messages: data.items.map((item: any) => ({
        id: item.id,
        author: item.authorDetails.displayName,
        avatar: item.authorDetails.profileImageUrl,
        role: {
          Owner: item.authorDetails.isChatOwner,
          Moderator: item.authorDetails.isChatModerator,
          Member: item.authorDetails.isChatSponsor,
          Verified: item.authorDetails.isVerified,
        },
        message: item.snippet.displayMessage,
        superChat: item.snippet.superChatDetails || null,
        superSticker: item.snippet.superStickerDetails || null,
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: data.nextPageToken,
      pollingIntervalMillis: data.pollingIntervalMillis,
    }
  })