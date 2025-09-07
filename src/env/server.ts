import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    VITE_SUPABASE_URL: z.string().min(1),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});