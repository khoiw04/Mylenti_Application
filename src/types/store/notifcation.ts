export type NotificationType = Array<{
    id: `${string}-${string}-${string}-${string}-${string}`,
    name: string,
    amount: string,
    message: string,
    timestamp: string,
    unread: boolean
}>