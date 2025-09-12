import { createServerFn } from '@tanstack/react-start'
import { getGoogleOBSAccessToken } from './auth.googleOBS'
import { clearCachedCookie, getCachedCookie, nativeFetch, setCachedCookie } from '@/lib/utils'

export const clearYouTubeOBSLiveStream = createServerFn()
  .handler(async () => {
    await clearCachedCookie({ data: { key: 'channelId' }})
    await clearCachedCookie({ data: { key: 'videoId' }})
    await clearCachedCookie({ data: { key: 'liveChatId' }})
  })

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
      throw new Error(JSON.stringify(data, null, 2), { cause: 500 }) 
    }

    const channelId = data.items[0]?.id
    await setCachedCookie({data: {key: 'channelId', value: channelId, maxAge: 1000 * 60 * 60 * 24 * 30}})
    return channelId
  })

export const getYouTubeOBSLiveStreamActiveLiveChatID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const cached = await getCachedCookie({data: { key: 'liveChatId'}})
        if (cached) return cached

        const accessToken = await getGoogleOBSAccessToken()
        const videoId = 'v8iNZyDwkuk'
        const res = await nativeFetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const data = await res.json()
        if (!data.items || data.items.length === 0) {
          throw new Error(JSON.stringify(data, null, 2), { cause: 500 })
        }

        const liveChatId = data.items[0]?.liveStreamingDetails?.activeLiveChatId
        if (!liveChatId) {
            throw new Error('Livestream không có live chat đang hoạt động')
        }

        await setCachedCookie({data : {key: 'liveChatId', value: liveChatId, maxAge: 1000 * 60 * 60 * 24}})
        return liveChatId
    })

export const getYouTubeOBSLiveChatMessage = createServerFn({ method: 'GET' })
  .validator((d: { nextPageToken: string | null }) => d)
  .handler(async ({ data: { nextPageToken } }) => {
    const accessToken = await getGoogleOBSAccessToken()
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
          owner: item.authorDetails.isChatOwner,
          mod: item.authorDetails.isChatModerator,
          member: item.authorDetails.isChatSponsor,
          verified: item.authorDetails.isVerified,
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