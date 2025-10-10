import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { profileQueries, useDiscordCommunityUser } from "@/lib/queries"
import { fallbackData, upsertDiscordUser } from "@/data/discord.sqlite"

export default function useSQLiteDiscordInfo() {
    const {
        meta: {
            id,
            username,
            global_name,
            email,
            avatar
        },
    } = useDiscordCommunityUser().data
    const router = useRouter()

useEffect(() => {
  (async () => {
    try {
      const result = await invoke("setup_tunnel", { userName: username });

      await upsertDiscordUser({
        id,
        email,
        name: global_name,
        user_name: username,
        avatar: avatar
      });
    } catch (error: any) {
      console.error("Tauri invoke error:", error);

      const parsedError = typeof error === "string" ? (() => {
        try {
          return JSON.parse(error);
        } catch {
          return {};
        }
      })() : error;

      if (
        parsedError.code === "HTTP_409" &&
        typeof parsedError.subdomain === "string"
      ) {
        console.warn("Tunnel already exists, continuing with subdomain:", parsedError.subdomain);

        await upsertDiscordUser({
          id,
          email,
          name: global_name,
          user_name: username,
          avatar: avatar
        });

        return;
      }

      toast.error("Lỗi khi tạo tunnel", {
        description: typeof error === "string" ? error : "Không rõ nguyên nhân",
        duration: 8000,
      });
    }
  })();
}, []);


    const { data } = useQuery({
        ...profileQueries.discord(username),
        placeholderData: fallbackData,
        enabled: !router.isServer
    })

    return { data: data!, avatar }
}