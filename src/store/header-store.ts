import { Store } from "@tanstack/store"
import type { HeaderPropsType, HeaderStateType, HeaderStrategyType } from "@/types/store/header"

export const HeaderState = new Store<HeaderStateType>({
  currentPath: "" as '/'
})

export const HeaderStrategy = new Store<HeaderStrategyType>({
  setCurrentPath: (path) =>
    HeaderState.setState((prev) => ({ ...prev, currentPath: path })),
})

export const HeaderProps = new Store<HeaderPropsType>({
  currentUser: '',
  display_avatar: '',
  display_name: '',
  email: '',
  handleLogOut: async () => {},
  isAuthenticated: false,
  socialInfo: {
    facebook: '',
    x: '',
    youtube: ''
  }
})