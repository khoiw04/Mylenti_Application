import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function DefaultAvatarMemeber({ 
  srcAvatar = './avatar-80-07.jpg', 
  srcTypeMember = 'https://yt3.ggpht.com/uekwnT0_9Q7maqBWXvbUa4-RpXroZyyThDwKak0rfFJW-CaMIokwDuzp5IZDsTLPS09WgF5b=s32-k-nd' 
}) {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={srcAvatar} />
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <span className="absolute -end-1.5 -top-1.5 size-5">
        <span className="sr-only">Memeber</span>
        <img src={srcTypeMember} />
      </span>
    </div>
  )
}