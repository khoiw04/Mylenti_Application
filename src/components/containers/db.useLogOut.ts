import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { logoutFn } from "@/func/auth.SupabaseLog"
import { authQueries } from "@/lib/queries"
import { clearGoogleOBSCookies } from "@/func/auth.googleOBS"
import { clearYouTubeOBSLiveStream } from "@/func/db.YouTubeChatFunc"
import { clearDiscordCookies } from "@/func/auth.discord"
import { CloudflareController } from "@/class/CloudflareController"

export default function useLogOut() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const handleLogOut = async () => {
      await clearYouTubeOBSLiveStream()
      await clearGoogleOBSCookies()
      await logoutFn()
      await clearDiscordCookies()
      await CloudflareController.stop()
      await queryClient.invalidateQueries(authQueries.user())
      router.invalidate()
      router.navigate({ to: '/', reloadDocument: true })
    }
    return { handleLogOut }
}