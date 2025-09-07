import type { BankDataType, DonateDataType, useRankDonatesType, useWindowVirtualizerType } from "../hooks/returnType"
import type { HoverCardProps } from "@radix-ui/react-hover-card"
import type { bankAvatarProps } from "../ui/donate"
import type { MouseEventHandler, RefObject } from "react"
import type { DialogProps } from "@radix-ui/react-dialog"
import type { UserProps } from "../ui/user"

export type UngHoProps = {
    userInfo: { 
        profileID: string 
    } & UserProps
    donateUI: {
        openDialog: NonNullable<DialogProps['open']>,
        openDialogChange: NonNullable<DialogProps['onOpenChange']>,
        openCardChange: HoverCardProps['onOpenChange']
        blockAction: MouseEventHandler,
        openCard: boolean
    } & bankAvatarProps
    donateData: {
        banksData: BankDataType,
        donateList: Array<DonateDataType>,
        rankDonates: useRankDonatesType
    }
    virtualizers: {
        commentRef: RefObject<HTMLDivElement | null>,
        rankRef: RefObject<HTMLTableSectionElement | null>,
        virtualizeComment: useWindowVirtualizerType,
        virtualizeRank: useWindowVirtualizerType,
    }
}