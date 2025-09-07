import type { headColorConfig } from "@/data/dashboard";

export type TitleProps = {title: keyof typeof headColorConfig, amount: number, previousAmount: number}