import { LucideShieldCheck } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function DefaultAvatarModerator({ srcAvatar = './avatar-80-07.jpg' }) {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={srcAvatar} />
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <span className="absolute -end-1.5 -top-1.5">
        <span className="sr-only">Moderator</span>
        <LucideShieldCheck fill="#000000" stroke="#ffffff" size={20} />
      </span>
    </div>
  )
}