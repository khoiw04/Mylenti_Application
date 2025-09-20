import { fallbackData, getDiscordUserByUserName } from "@/data/discord.sqlite";

export async function getDiscordProfile(user_name: string) {
  if (typeof window === 'undefined') return fallbackData
  const data = await getDiscordUserByUserName(user_name)
  return data ?? fallbackData
}