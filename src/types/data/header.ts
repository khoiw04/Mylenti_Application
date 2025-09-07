import type { navigationLinks } from "@/data/header"

export type NavigationLinkType = typeof navigationLinks[number]
export type NavigationHrefType = NavigationLinkType["href"]