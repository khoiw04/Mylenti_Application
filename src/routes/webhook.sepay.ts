import { createServerFileRoute } from '@tanstack/react-start/server'
import { initWebhookLogTable, logWebhookFailure, upsertSepayDonateTable } from '@/data/sepay.sqlite'
import { webhookSepaySchema } from '@/schema'
import { getAllDiscordUsers } from '@/data/discord.sqlite'

export const ServerRoute = createServerFileRoute('/webhook/sepay')
  .methods({
    POST: async ({ request }) => {
        const authHeader = request.headers.get('authorization')
        const source = request.headers.get('user-agent') ?? 'unknown'
        if (!authHeader) {
            await initWebhookLogTable()
            await logWebhookFailure({
                source,
                attempted_key: '',
                reason: 'Thiếu header Authorization',
            })
            return new Response('Thiếu header Authorization', { status: 401 })
        }

        const allUsers = await getAllDiscordUsers(['api_key'])
        const matchedUser = allUsers.find(user => `Apikey ${user.api_key}` === authHeader)

        if (!matchedUser) {
            await initWebhookLogTable()
            await logWebhookFailure({
                source,
                attempted_key: authHeader,
                reason: 'Sai API Key',
            })
            return new Response('Unauthorized', { status: 401 })
        }

        const payload = await request.json()
        const parsed = webhookSepaySchema.safeParse(payload)

        if (!parsed.success) {
            await initWebhookLogTable()
            await logWebhookFailure({
                source,
                attempted_key: authHeader,
                matched_user: matchedUser.user_name,
                reason: 'Payload không hợp lệ',
                payload: JSON.stringify(payload),
            })
            return new Response('Invalid payload', { status: 400 })
        }

        const tx = parsed.data
        await upsertSepayDonateTable({
            ...tx,
            status: 'received',
        })
        return new Response('Webhook received', { status: 200 })
    },
  })