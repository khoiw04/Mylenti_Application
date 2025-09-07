import {
  BoltIcon,
  BookOpenIcon,
  CircleUser,
  LogOutIcon,
  UserPenIcon 
} from "lucide-react"

import { useRouter } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { HeaderProps } from "@/store/header-store"

export default function UserMenu() {
  const router = useRouter()
  const { display_avatar, display_name, email, handleLogOut } = useStore(HeaderProps)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          {display_avatar === '' ?
            <div className="bg_icon_header">
              <CircleUser className="icon_header" />
            </div> :
            <Avatar>
              <AvatarImage src={display_avatar} />
              <AvatarFallback>
                <Skeleton className="size-full" />
              </AvatarFallback>
            </Avatar>
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {display_name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.navigate({ to: '/ly-lich' })}>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Lý lịch</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.navigate({ to: '/ngan-hang' })}>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Ngân hàng</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.navigate({ to: '/ke-toan' })}>
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Lịch sử / Thống kê</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
