export type WebhookLogEntry = {
  source: string
  attempted_key: string
  matched_user?: string | null
  reason: string
  payload?: string
}