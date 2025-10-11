import { LucideInbox, LucideLink2, LucideWebhook } from "lucide-react"

export const items = [
  {
    title: "Đường Link",
    url: "Đường_Link",
    icon: LucideLink2,
  },
  {
    title: "Cập Nhật",
    url: "UPDATE",
    icon: LucideInbox,
  },
  {
    title: "Cloudflare Tunnel",
    url: "CLOUDFLARE_TUNNEL",
    icon: LucideWebhook,
  }
] 

export const links = [
    {
        title: 'Webhook',
        slag: '/webhook/sepay'
    },
    {
        title: 'Donations',
        slag: (user_name: string) => `/data/${user_name}/donations`
    },
    {
        title: 'Health',
        slag: '/health'
    }
] as const