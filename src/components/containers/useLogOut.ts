import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { logoutFn } from "@/func/auth.Log"
import { authQueries } from "@/lib/queries"

export default function useLogOut() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const handleLogOut = async () => {
      await logoutFn()
      await queryClient.invalidateQueries(authQueries.user())
      router.invalidate()
      router.navigate({ to: '/', reloadDocument: true })
    }
    return { handleLogOut }
}