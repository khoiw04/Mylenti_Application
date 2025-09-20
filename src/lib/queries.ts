import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { UseSuspenseInfiniteQueryResult } from "@tanstack/react-query";
import { getBankDatabase, getDonateDatabase } from "@/func/db.SupabaseInfo";
import { getProfile } from "@/func/db.SupabaseProfile";
import { getUser } from "@/func/auth.SupabaseUser";
import { getDiscordUserInfo } from "@/func/auth.discord";
import { getDiscordProfile } from "@/func/db.DiscordSQLite";

export const bankQueries = {
    all: ['bank'],
    bankQueries: (user_name: string) =>
        queryOptions({
            queryKey: [...bankQueries.all],
            queryFn: () => getBankDatabase({ data: { user_name } })
        })
}

export const donateQueries = {
    all: ['donate'],
    donate: (user_name: string) =>
        queryOptions({
            queryKey: [...donateQueries.all],
            queryFn: () => getDonateDatabase({ data: { user_name } })
        })
}

export const profileQueries = {
    all: ['profile'],
    user: (user_name: string) =>
        queryOptions({
            queryKey: [...profileQueries.all],
            queryFn: () => getProfile({ data: { user_name } })
        }),
    discord: (user_name: string) =>
        queryOptions({
            queryKey: [...profileQueries.all, 'discord', user_name],
            queryFn: () => getDiscordProfile(user_name)
        }),
}

export const authQueries = {
    all: ['auth'],
    user: () =>
        queryOptions({
            queryKey: [...authQueries.all, 'user'],
            queryFn: () => getUser()
        }),
    discord: () =>    
        queryOptions({
            queryKey: [...authQueries.all, 'discord'],
            queryFn: () => getDiscordUserInfo()
        }),
}

export const useAuthenticatedUser = () => {
    const authQuery = useSuspenseQuery(authQueries.user())

    return authQuery as UseSuspenseInfiniteQueryResult<typeof authQuery.data>
}

export const useDiscordCommunityUser = () => {
    const authQuery = useSuspenseQuery(authQueries.discord())

    return authQuery as UseSuspenseInfiniteQueryResult<typeof authQuery.data>
}