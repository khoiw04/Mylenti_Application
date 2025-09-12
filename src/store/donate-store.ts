import { Store } from "@tanstack/store"
import type { donateStoreProps } from "@/types";

export const donatePropsStore = new Store<donateStoreProps>({
  donateData: {
    donateList: [],
    rankDonates: [],
  },
  virtualizers: {
    commentRef: { current: null },
    rankRef: { current: null },
    virtualizeComment: {} as donateStoreProps['virtualizers']['virtualizeComment'],
    virtualizeRank: {} as donateStoreProps['virtualizers']['virtualizeRank']
  }
});