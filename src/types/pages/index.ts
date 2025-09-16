export type ButtonFunctionType = { 
    icon: React.ReactNode, 
    title: string, 
    description: string,
    src?: string,
    align?: Exclude<AlignSetting, 'left' | 'right'>,
    onClick?: () => void
}