import { useServerFn } from "@tanstack/react-start"
import { useRouter } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import useAuthInfo from "../../hooks/useAuthInfo"
import { createMutation } from "@/hooks/createMutations"
import { updateUser } from "@/func/auth.UpdateInfo"
import { authQueries, profileQueries } from "@/lib/queries"

export function useResetMutation() {
    const router = useRouter()
    const info = useAuthInfo()
    const queryClient = useQueryClient()
    const serverFn = useServerFn(updateUser)
    return createMutation(serverFn, {
        onSuccess() {
            queryClient.invalidateQueries(authQueries.user())
            queryClient.invalidateQueries(profileQueries.user(info.currentUser))
        },
        toastOptions: {
            onAutoClose() {router.navigate({ to: '/' })},
            onDismiss() {router.navigate({ to: '/' })}
        }
    })
}