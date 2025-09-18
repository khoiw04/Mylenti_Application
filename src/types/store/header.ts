import type { NavigationHrefType } from "../data/header";

export type HeaderStateType = { currentPath: NavigationHrefType }
export type HeaderStrategyType = { setCurrentPath: (path: NavigationHrefType) => void }