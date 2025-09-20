import { useServerFn } from "@tanstack/react-start"
import { useRouter } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { createMutation } from "@/hooks/createMutations"
import { updateUser } from "@/func/auth.UpdateInfo"
import { authQueries, profileQueries } from "@/lib/queries"
import { useAuthInfoExternalStore } from "@/hooks/useAuthSupabaseInfo"

export function useResetMutation() {
    const router = useRouter()
    const authInfo = useAuthInfoExternalStore()
    const queryClient = useQueryClient()
    const serverFn = useServerFn(updateUser)
    return createMutation(serverFn, {
        onSuccess() {
            queryClient.invalidateQueries(authQueries.user())
            queryClient.invalidateQueries(profileQueries.user(authInfo.currentUser))
        },
        toastOptions: {
            onAutoClose() {router.navigate({ to: '/' })},
            onDismiss() {router.navigate({ to: '/' })}
        }
    })
}