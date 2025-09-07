import type { useAuthInfoType, useLogOutType } from "../hooks/returnType";
import type { NavigationHrefType } from "../data/header";

export type HeaderStateType = { currentPath: NavigationHrefType }
export type HeaderStrategyType = { setCurrentPath: (path: NavigationHrefType) => void }

export type HeaderPropsType = useAuthInfoType & useLogOutType