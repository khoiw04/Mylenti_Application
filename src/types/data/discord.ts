export type SQLiteDiscordUser = {
    id: string,
    name: string,
    user_name: string,
    email: string,
    full_name?: string | null,
    api_key?: string | null,
    number?: string | null,
    bank?: string | null,
    youtube?: string | null,
    facebook?: string | null,
    x?: string | null
}