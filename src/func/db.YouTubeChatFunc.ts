/* eslint-disable no-shadow */
import { createServerFn } from '@tanstack/react-start'
import { getValidGoogleOBSAccessToken } from './auth.googleOBS'
import type { YouTubeChatResponse } from '@/types'
import { clearCachedCookie, getCachedCookie, nativeFetch, setCachedCookie } from '@/lib/utils'

export const clearYouTubeOBSLiveStream = createServerFn()
  .handler(async () => {
    await clearCachedCookie({ data: { key: 'channelId' }})
    await clearCachedCookie({ data: { key: 'videoId' }})
    await clearCachedCookie({ data: { key: 'liveChatId' }})
  })

export const getYouTubeOBSChannelID = createServerFn({ method: 'GET' })
  .handler(async () => {
    const cached = await getCachedCookie({data: { key: 'channelId' }})
    if (cached) return cached

    const accessToken = await getValidGoogleOBSAccessToken()
    const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/channels?part=id&mine=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()

    if (!data.items || data.items.length === 0) {
      throw new Error(JSON.stringify(data, null, 2), { cause: 500 }) 
    }

    const channelId = data.items[0]?.id
    await setCachedCookie({data: {key: 'channelId', value: channelId, maxAge: 1000 * 60 * 60 * 24 * 30}})
    return channelId
  })

export const getYouTubeOBSVideoId = createServerFn({ method: 'GET' })
  .validator((d: { useVideoIDCached: boolean }) => d)
  .handler(async ({ data: { useVideoIDCached } }) => {
    const cached = await getCachedCookie({data: { key: 'videoId' }})
    if (cached && useVideoIDCached) return cached

    const accessToken = await getValidGoogleOBSAccessToken()
    const channelId = await getYouTubeOBSChannelID()

    const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&type=video&eventType=live`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()
    if (!data.items || data.items.length === 0) {
      throw new Error('Không tìm thấy videoID đang hoạt động')
    }

    const videoId = data.items[0].id.videoId
    await setCachedCookie({data: {key: 'videoId', value: videoId, maxAge: 1000 * 60 * 60 * 3}})
    return videoId
  })

export const getYouTubeOBSLiveStreamActiveLiveChatID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const cached = await getCachedCookie({data: { key: 'liveChatId' }})
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

        await setCachedCookie({data : {key: 'liveChatId', value: liveChatId, maxAge: 1000 * 60 * 60 * 6}})
        return liveChatId
    })

export const getYouTubeOBSLiveChatMessage = createServerFn({ method: 'GET' })
  .validator((d: { nextPageToken: string | null }) => d)
  .handler<YouTubeChatResponse>(async ({ data: { nextPageToken } }) => {
    const accessToken = await getValidGoogleOBSAccessToken()
    const liveChatId = await getYouTubeOBSLiveStreamActiveLiveChatID()

    const url = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages')
    url.searchParams.set('liveChatId', liveChatId)
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