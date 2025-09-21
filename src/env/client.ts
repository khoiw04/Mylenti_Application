import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPABASE_URL: z.string().min(1),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
    VITE_DISCORD_CLIENTID: z.string().min(1),
    VITE_DISCORD_CLIENTSECRET: z.string().min(1),
    VITE_OAUTH_YOUTUBE_ID: z.string().min(1),
    VITE_OAUTH_YOUTUBE_SERECT: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});