import type { presets } from "@/data/obs-overlay";

type OBSCheckBoxArrayType = {array: typeof presets}

export type SearchProps = 
    { 
        value: string;
        onValueChange: (value: string) => void
        open: boolean
        onOpenChange: (boolean: boolean) => void
    } & OBSCheckBoxArrayType