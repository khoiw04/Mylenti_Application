import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { profileQueries, useDiscordCommunityUser } from "@/lib/queries"
import { fallbackData, upsertDiscordUser } from "@/data/discord.sqlite"

export default function useSQLiteDiscordInfo() {
  const {
    meta: { id, username, global_name, email, avatar },
  } = useDiscordCommunityUser().data;

  const router = useRouter();

  const userPayload = {
    id,
    email,
    name: global_name,
    user_name: username,
    avatar,
  };

  useEffect(() => {
    (async () => {
      try {
        await invoke("setup_tunnel", { userName: username });
        await upsertDiscordUser(userPayload);
      } catch (error: any) {
        const parsedError =
          typeof error === "string"
            ? (() => {
                try {
                  return JSON.parse(error);
                } catch {
                  return {};
                }
              })()
            : error;

        if (parsedError.code === "HTTP_409" && typeof parsedError.subdomain === "string") {
          console.warn("Tunnel already exists, continuing with subdomain:", parsedError.subdomain);
          await upsertDiscordUser(userPayload);
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
    enabled: !router.isServer,
  });

  return { data: data!, avatar };
}