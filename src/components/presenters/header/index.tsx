import { Link } from "@tanstack/react-router"
import Bottom from "./bottom"
import Search from "./search"
import Burger from "./burger"
import Logo from "@/components/presenters/header/logo"
import NotificationMenu from "@/components/presenters/header/notification-menu"
import UserMenu from "@/components/presenters/header/user-menu"
import useHeader from "@/components/containers/useHeader"

export default function Main() {
  useHeader()

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
            <Burger />
          <div className="flex items-center">
            <Link to='/' className="text-primary hover:text-primary/90">
              <Logo />
            </Link>
          </div>
        </div>
        <div className="grow">
          <Search />
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
      <div className="border-t py-2 max-md:hidden flex justify-center">
        <Bottom />
      </div>
    </header>
  )
}
