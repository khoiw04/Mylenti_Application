import { createServerFn } from '@tanstack/react-start'
import { getGoogleOBSAccessToken } from './auth.googleOBS'
import { clearCachedCookie, getCachedCookie, nativeFetch, setCachedCookie } from '@/lib/utils'

export const getYouTubeOBSChannelID = createServerFn({ method: 'GET' })
  .handler(async () => {
    const cached = await getCachedCookie({data: { key: 'channelId'}})
    if (cached) return cached

    const accessToken = await getGoogleOBSAccessToken()
    const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/channels?part=id&mine=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()

    if (!data.items || data.items.length === 0) {
      throw new Error(data.error.message, { cause: data.error.code ?? 500 })
    }

    const channelId = data.items[0]?.id
    await setCachedCookie({data: {key: 'channelId', value: channelId, maxAge: 1000 * 60 * 60 * 24 * 30}})
    return channelId
  })

export const getYouTubeOBSLiveStreamVideoID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const cached = await getCachedCookie({data: { key: 'videoId'}})
        if (cached) return cached

        const accessToken = await getGoogleOBSAccessToken()
        const channelId = await getYouTubeOBSChannelID()
        const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&eventType=live&type=video`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const data = await res.json()
        if (!data.items || data.items.length === 0) {
          throw new Error(data.error.message, { cause: data.error.code ?? 500 })
        }

        const videoId = data.items[0]?.id?.videoId
        await setCachedCookie({data : {key: 'videoId', value: videoId, maxAge: 1000 * 60 * 60 * 24}})
        return videoId
    })

export const getYouTubeOBSLiveStreamActiveLiveChatID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const cached = await getCachedCookie({data: { key: 'liveChatId'}})
        if (cached) return cached

        const accessToken = await getGoogleOBSAccessToken()
        const videoId = await getYouTubeOBSLiveStreamVideoID()
        const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const data = await res.json()
        if (!data.items || data.items.length === 0) {
          throw new Error(data.error.message, { cause: data.error.code ?? 500 })
        }

        const liveChatId = data.items[0]?.liveStreamingDetails?.activeLiveChatId
        if (!liveChatId) {
            throw new Error('Livestream không có live chat đang hoạt động')
        }

        await setCachedCookie({data : {key: 'liveChatId', value: liveChatId, maxAge: 1000 * 60 * 60 * 24}})
        return liveChatId
    })

export const getYouTubeOBSLiveStreamTitle = createServerFn({ method: 'GET' })
  .handler(async () => {
    const cached = await getCachedCookie({data: { key: 'liveTitle'}})
    if (cached) return cached

    const accessToken = await getGoogleOBSAccessToken()
    const videoId = await getYouTubeOBSLiveStreamVideoID()

    const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()
    const title = data.items[0]?.snippet?.title

    if (!title) {
      throw new Error('Không lấy được tiêu đề livestream')
    }

    await setCachedCookie({data : {key: 'liveTitle', value: title, maxAge: 1000 * 60 * 60 * 24}})
    return title
  })

export const clearYouTubeOBSLiveStream = createServerFn()
  .handler(async () => {
    await clearCachedCookie({ data: { key: 'channelId' }})
    await clearCachedCookie({ data: { key: 'videoId' }})
    await clearCachedCookie({ data: { key: 'liveChatId' }})
    await clearCachedCookie({ data: { key: 'liveTitle' }})
  })

export const getYouTubeOBSLiveChatMessage = createServerFn({ method: 'GET' })
    .validator((d: { nextPageToken: string | null }) => d)
    .handler(async ({ data: { nextPageToken } }) => {
        const accessToken = await getGoogleOBSAccessToken()
        const liveChatId = await getYouTubeOBSLiveStreamActiveLiveChatID()

        const url = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages')
        url.searchParams.set('liveChatId', liveChatId)
        url.searchParams.set('part', 'snippet,authorDetails')
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
            throw new Error('Không lấy được tin nhắn chat')
        }

        return {
            messages: data.items.map((item: any) => ({
                id: item.id,
                author: item.authorDetails.displayName,
                message: item.snippet.displayMessage,
                publishedAt: item.snippet.publishedAt,
            })),
            nextPageToken: data.nextPageToken,
            pollingIntervalMillis: data.pollingIntervalMillis,
        }
    })