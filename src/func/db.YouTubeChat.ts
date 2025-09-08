import { createServerFn } from '@tanstack/react-start'
import { getGoogleOBSAccessToken } from './auth.googleOBS'

export const getYouTubeOBSChannelID = createServerFn({ method: 'GET' })
  .handler(async () => {
    const accessToken = await getGoogleOBSAccessToken()
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&mine=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()

    if (!data.items || data.items.length === 0) {
      throw new Error('Không tìm thấy kênh YouTube của người dùng')
    }

    return data.items[0]?.id
  })

export const getYouTubeOBSLiveStreamVideoID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const accessToken = await getGoogleOBSAccessToken()
        const channelId = await getYouTubeOBSChannelID()
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&eventType=live&type=video`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const data = await res.json()
        if (!data.items || data.items.length === 0) {
            throw new Error('Không có livestream đang diễn ra')
        }

        return data.items[0]?.id?.videoId
    })

export const getYouTubeOBSLiveStreamActiveLiveChatID = createServerFn({ method: 'GET' })
    .handler(async () => {
        const accessToken = await getGoogleOBSAccessToken()
        const videoId = await getYouTubeOBSLiveStreamVideoID()
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        })

        const data = await res.json()
        if (!data.items || data.items.length === 0) {
            throw new Error('Không có livestream đang diễn ra')
        }

        const liveChatId = data.items[0]?.liveStreamingDetails?.activeLiveChatId
        if (!liveChatId) {
            throw new Error('Livestream không có live chat đang hoạt động')
        }

        return liveChatId
    })

export const getYouTubeOBSLiveStreamTitle = createServerFn({ method: 'GET' })
  .handler(async () => {
    const accessToken = await getGoogleOBSAccessToken()
    const videoId = await getYouTubeOBSLiveStreamVideoID()

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`, {
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

    return title
  })

export const getYouTubeOBSLiveChatMessage = createServerFn({ method: 'GET' })
    .handler(async () => {
        const accessToken = await getGoogleOBSAccessToken()
        const liveChatId = await getYouTubeOBSLiveStreamActiveLiveChatID()
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails`, {
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