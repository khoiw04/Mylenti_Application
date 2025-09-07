import { Store } from "@tanstack/store"
import type { useBankFormType } from "@/types/hooks/returnType"


export const bankPropsStore = new Store<{
    form: useBankFormType
    checkboxData: Array<string>
    avatar: string
}>({
    form: {} as useBankFormType,
    checkboxData: [],
    avatar: ''
})