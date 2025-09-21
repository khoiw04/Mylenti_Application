import type { headColorConfig } from "@/data/settings";

export type TitleProps = {title: keyof typeof headColorConfig, amount: number, previousAmount: number}