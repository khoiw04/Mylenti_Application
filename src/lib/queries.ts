import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { UseSuspenseInfiniteQueryResult } from "@tanstack/react-query";
import { getBank, getDonate } from "@/func/auth.Info";
import { getProfile } from "@/func/auth.Profile";
import { getUser } from "@/func/auth.User";

export const bankQueries = {
    all: ['bank'],
    bankQueries: (user_name: string) =>
        queryOptions({
            queryKey: [...bankQueries.all],
            queryFn: () => getBank({ data: { user_name } })
        })
}

export const donateQueries = {
    all: ['donate'],
    donate: (user_name: string) =>
        queryOptions({
            queryKey: [...donateQueries.all],
            queryFn: () => getDonate({ data: { user_name } })
        })
}

export const profileQueries = {
    all: ['profile'],
    user: (user_name: string) =>
        queryOptions({
            queryKey: [...profileQueries.all],
            queryFn: () => getProfile({ data: { user_name } })
        })
}

export const authQueries = {
    all: ['auth'],
    user: () =>
        queryOptions({
            queryKey: [...authQueries.all, 'user'],
            queryFn: () => getUser()
        })
}

export const useAuthenticatedUser = () => {
    const authQuery = useSuspenseQuery(authQueries.user())

    return authQuery as UseSuspenseInfiniteQueryResult<typeof authQuery.data>
}