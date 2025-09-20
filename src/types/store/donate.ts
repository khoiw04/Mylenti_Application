import type { Virtualizer } from "@tanstack/react-virtual"
import type { RefObject } from "react"
import type { DonateDataType, useRankDonatesType } from "../hooks/returnType"

export type donateStoreProps = {
    donateData: {
      donateList: Array<DonateDataType>,
      rankDonates: useRankDonatesType
    }
    virtualizers: {
        commentRef: RefObject<HTMLDivElement | null>,
        rankRef: RefObject<HTMLDivElement | null>,
        virtualizeComment: Virtualizer<Element, Element>,
        virtualizeRank: Virtualizer<Element, Element>,
    }
}

export type donateDiscordStoreRealTime = {
  code: string
  display_name: string
  message: string
  user_name: string
  transfer_amount: number
}  
