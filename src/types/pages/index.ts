import type { DOMAttributes } from "react"

export type ButtonFunctionType = { 
    icon: React.ReactNode, 
    title: string, 
    description: string,
    src?: string,
    align?: Exclude<AlignSetting, 'left' | 'right'>,
    onClick?: DOMAttributes<HTMLButtonElement>['onClick']
}