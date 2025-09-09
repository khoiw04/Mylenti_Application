import type { useLogOutType } from "../hooks/returnType";
import type { NavigationHrefType } from "../data/header";

export type HeaderStateType = { currentPath: NavigationHrefType }
export type HeaderStrategyType = { setCurrentPath: (path: NavigationHrefType) => void } & useLogOutType