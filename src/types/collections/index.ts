import type { ChatMessageSchemaType } from "../schema";

export type LiveChatMessageType = {
    messages: Array<ChatMessageSchemaType>,
    nextPageToken: string,
    pollingIntervalMillis: number,
}