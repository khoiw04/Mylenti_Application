import { useMemo } from "react"
import { useStore } from "@tanstack/react-store"
import { dashboardData, dashboardState } from "@/store"
import { Route } from "@/routes/ke-toan"
import { daysMap } from "@/data/settings"

export function useDashboard() {
    const list = Route.useLoaderData()
    const timeRange = useStore(dashboardState, (state) => state.timeRange)
    if (!list) return

    const donateAmount = useMemo(
        () => list.reduce((sum, item) => sum + item.transfer_amount, 0),
        []
    )

    const chartData = useMemo(() => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysMap[timeRange]);

        return list
        .filter(item => new Date(item.created_at) >= startDate)
        .reduce((acc, curr) => {
            const day = new Date(curr.created_at).toISOString().split('T')[0];
            acc[day] ??= { date: day, donateAmount: 0 };
            acc[day].donateAmount += curr.transfer_amount;
            return acc;
        }, {} as Record<string, { date: string; donateAmount: number }>);
    }, [timeRange])
    const donateData = useMemo(() => {
        const now = new Date();
        const days = daysMap[timeRange];

        const startCurrent = new Date(now);
        startCurrent.setDate(startCurrent.getDate() - days);

        const startPrevious = new Date(startCurrent);
        startPrevious.setDate(startPrevious.getDate() - days);

        const sumInRange = (start: Date, end: Date) =>
        list
            .filter(d => new Date(d.created_at) >= start && new Date(d.created_at) < end)
            .reduce((sum, d) => sum + d.transfer_amount, 0);

        const currentAmount = sumInRange(startCurrent, now);
        const previousAmount = sumInRange(startPrevious, startCurrent);

        const changePercent =
        previousAmount === 0
            ? currentAmount > 0 ? 100 : 0
            : ((currentAmount - previousAmount) / previousAmount) * 100;

        return { currentAmount, previousAmount, changePercent };
    }, [timeRange])
    const dashboardProps = useMemo(() => ({
        donateData,
        donateList: list,
        donateAmount: donateAmount,
        chartData: Object.values(chartData).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    }), [])

    dashboardData.setState(dashboardProps)
}