import {
  BookOpenIcon,
  CircleUser,
  LandmarkIcon,
  LogInIcon,
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
import { useAuthInfoExternalStore } from "@/hooks/useAuthSupabaseInfo"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useLogOut from "@/components/containers/db.useLogOut"
import { useDiscordCommunityUser } from "@/lib/queries"
import { addAtPrefix } from "@/lib/utils"
import { DiscordStraregy } from "@/store"

export default function UserMenu() {
  const router = useRouter()
  const { handleLogOut } = useLogOut()
  const { onDiscordLogInClick } = useStore(DiscordStraregy)
  const { isAuthenticated, display_avatar, display_name, email } = useAuthInfoExternalStore()
  const DiscordUser = useDiscordCommunityUser().data

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto z-50 p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage
              src={
                display_avatar !== ''
                  ? display_avatar
                  : DiscordUser.meta.avatar !== ''
                  ? DiscordUser.meta.avatar
                  : undefined
              }
            />
            <AvatarFallback>
              {display_avatar === '' && DiscordUser.meta.avatar === '' ? (
                <div className="bg_icon_header">
                  <CircleUser className="icon_header" />
                </div>
              ) : (
                <Skeleton className="size-full" />
              )}
            </AvatarFallback>
          </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64" align="end">
          {isAuthenticated &&
          <>
            <DropdownMenuLabel className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-sm font-medium">
                {display_name}
              </span>
              <span className="text-muted-foreground truncate text-xs font-normal">
                {email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
          }
          {DiscordUser.isAuthenticated &&
          <>
            <DropdownMenuLabel className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-sm font-medium">
                {addAtPrefix(DiscordUser.meta.username)}
              </span>
              <span className="text-muted-foreground truncate text-xs font-normal">
                {DiscordUser.meta.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
          }
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.navigate({ to: '/ly-lich' })}>
              <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Lý lịch</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.navigate({ to: '/ngan-hang' })}>
              <LandmarkIcon size={16} className="opacity-60" aria-hidden="true" />
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
          {DiscordUser.isAuthenticated || isAuthenticated ?
          <DropdownMenuItem onClick={async () => await handleLogOut()}>
            <LogInIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
          :
          <DropdownMenuItem onClick={onDiscordLogInClick}>
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Đăng Nhập</span>
          </DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[700px] overflow-clip p-0">
        <DialogTitle className="sr-only">
          Cài đặt
          <DialogDescription>
            Cập nhật, API KEY, ...
          </DialogDescription>
        </DialogTitle>
        <SettingApp />
      </DialogContent>
    </Dialog>
  )
}
