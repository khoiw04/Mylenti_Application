import { useEffect, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual";
import type { DonateDataType, VirtualizerConfig } from "@/types";
import { donatePropsStore } from "@/store";
import { Route } from "@/routes/ke-toan";
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo";

export function useRankDonates(donateList: Array<DonateDataType>, currentUser: string) {
  return useMemo(() => {
      const grouped = Object.values(
        donateList.reduce((acc, curr) => {
          const key = curr.user_name
           
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!acc[key]) {
            acc[key] = { ...curr }
          } else {
            acc[key].transfer_amount += curr.transfer_amount
          }
          return acc
        }, {} as Record<string, typeof donateList[0]>)
      )

      return grouped.sort((a, b) => {
        if (a.user_name === currentUser) return -1
        if (b.user_name === currentUser) return 1
        return 0
      }).sort((a, b) => b.transfer_amount - a.transfer_amount)
    }, [donateList, currentUser])
}

function createVirtualizer({ count, estimateSize, scrollElement }: VirtualizerConfig) {
  return useVirtualizer({
    count,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimateSize,
    overscan: 5,
  })
}

export const useDonate = () => {
  const authInfo = useAuthInfoExternalStore()
  const donateList = Route.useLoaderData()
  if (!donateList) return null
  const rankDonates = useRankDonates(donateList, authInfo.currentUser)

  const commentRef = useRef<HTMLDivElement | null>(null)
  const rankRef = useRef<HTMLDivElement | null>(null)
  const [viewportDonateRef, setViewportDonateRef] = useState<HTMLDivElement | null>(null)
  const [viewportRankRef, setViewportRankRef] = useState<HTMLDivElement | null>(null)

  const virtualizeComment = createVirtualizer({
    count: donateList.length,
    estimateSize: 45,
    scrollElement: viewportDonateRef,
  })

  const virtualizeRank = createVirtualizer({
    count: rankDonates.length,
    estimateSize: 40,
    scrollElement: viewportRankRef,
  })

  useEffect(() => {
    if (commentRef.current) {
      const viewport = commentRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (viewport) setViewportDonateRef(viewport as HTMLDivElement)
    }
  }, [commentRef.current])

  useEffect(() => {
    if (rankRef.current) {
      const viewport = rankRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (viewport) setViewportRankRef(viewport as HTMLDivElement)
    }
  }, [rankRef.current])

  useEffect(() => {
    if (viewportDonateRef && virtualizeComment.getVirtualItems().length > 0) {
      virtualizeComment.scrollToIndex(donateList.length + 1)
    }
  }, [viewportDonateRef, virtualizeComment, donateList.length])

  const donateProps = useMemo(() => ({
    donateData: {
      donateList: [...donateList].reverse(),
      rankDonates,
    },
    virtualizers: {
      commentRef,
      rankRef,
      virtualizeComment,
      virtualizeRank,
    },
  }), [])

  donatePropsStore.setState(donateProps)
}