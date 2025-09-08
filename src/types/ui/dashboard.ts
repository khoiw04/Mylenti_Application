import type { headColorConfig } from "@/data/chart";

export type TitleProps = {title: keyof typeof headColorConfig, amount: number, previousAmount: number}