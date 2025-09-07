import type { ComponentProps } from "react"
import type { VariantProps } from "class-variance-authority"
import type { inputVariants } from "@/components/ui/input"
import type { buttonVariants } from "@/components/ui/button"

export type ShowBugType = { showBug?: boolean }
export type TextFieldType = {
        asTextarea?: boolean
        asNumeric?: boolean
        showLabel?: boolean
}
& React.ComponentProps<'input'> 
& React.ComponentProps<'textarea'> 
& VariantProps<typeof inputVariants>

export type ButtonFieldType = {
        asChild?: boolean
        children: React.ReactNode
} 
& ComponentProps<"button"> 
& VariantProps<typeof buttonVariants>

export type ComboBoxType = { 
        className?: string, 
        placeholder?: string, 
        asTextarea?: boolean, 
        checkboxData: Array<string> 
} 
& ShowBugType
& ComponentProps<"button"> &
VariantProps<typeof buttonVariants> &
{require?: boolean}