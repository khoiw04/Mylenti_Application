import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { homeDir, join } from "@tauri-apps/api/path"
import { exists } from "@tauri-apps/plugin-fs"
import { profileQueries, useDiscordCommunityUser } from "@/lib/queries"
import { fallbackData, upsertDiscordUser } from "@/data/discord.sqlite"

export default function useSQLiteDiscordInfo() {
  const {
    meta: { id, username, global_name, email, avatar },
  } = useDiscordCommunityUser().data;

  const userPayload = {
    id,
    email,
    name: global_name,
    user_name: username,
    avatar,
  };

  useEffect(() => {
    if (!username) return

    (async () => {
      try {
        const home = await homeDir();
        const configPath = await join(home, '.cloudflared', `config_${username}.yml`);
        const fileExists = await exists(configPath);

        if (!fileExists) {
          await invoke("setup_tunnel", { userName: username });
        } 

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


  const router = useRouter();

  const { data } = useQuery({
    ...profileQueries.discord(username),
    placeholderData: fallbackData,
    enabled: !router.isServer,
  });

  return { data: data!, avatar };
}