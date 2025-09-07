import { Store } from "@tanstack/store"
import type { useResetFormType } from "@/types/hooks/returnType"

export const useResetPropsStore = new Store<useResetFormType>({
    form: {} as useResetFormType['form'],
    checkImages: ''
})