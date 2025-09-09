import { Store } from "@tanstack/store"
import type { HeaderStateType, HeaderStrategyType } from "@/types/store/header"

export const HeaderState = new Store<HeaderStateType>({
  currentPath: "" as '/'
})

export const HeaderStrategy = new Store<HeaderStrategyType>({
  setCurrentPath: (path) =>
    HeaderState.setState((prev) => ({ ...prev, currentPath: path })),
  handleLogOut: async () => {},
})