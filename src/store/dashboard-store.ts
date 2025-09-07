import { Store } from "@tanstack/store"
import type { dayKeyType } from "@/data/settings"
import type { DonateDataType } from "@/types/hooks/returnType"

export const dashboardData = new Store<{
    donateList: Array<DonateDataType> | null
    donateData: { currentAmount: number, previousAmount: number, changePercent: number }
    chartData: Array<{ date: string; donateAmount: number }>
    donateAmount: number
}>({
    donateList: null,
    chartData: [],
    donateData: { changePercent: 0, currentAmount: 0, previousAmount: 0 },
    donateAmount: 0
})

export const dashboardState = new Store<{
    timeRange: dayKeyType
}>({
    timeRange: '7d'
})

export const dashboardStrategy = new Store<{
    timeRangeChange: (value: dayKeyType) => void
}>({
    timeRangeChange: (value) => dashboardState.setState((prev) => ({ ...prev, timeRange: value }))
})