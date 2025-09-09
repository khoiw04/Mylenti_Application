import {
  BoltIcon,
  BookOpenIcon,
  CircleUser,
  LogOutIcon,
  LucideWrench,
  UserPenIcon 
} from "lucide-react"

import { useRouter } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import SettingApp from "@/components/presenters/settingAPP"
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
import { HeaderStrategy } from "@/store/header-store"
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function UserMenu() {
  const router = useRouter()
  const { handleLogOut } = useStore(HeaderStrategy)
  const { display_avatar, display_name, email } = useAuthInfoExternalStore()

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto z-50 p-0 hover:bg-transparent">
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
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <LucideWrench size={16} className="opacity-60" aria-hidden="true" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
            </DialogTrigger>
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[700px] overflow-clip p-0">
        <SettingApp />
      </DialogContent>
    </Dialog>
  )
}
