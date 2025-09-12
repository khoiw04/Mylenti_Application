import { Store } from "@tanstack/store"
import type { useResetFormType } from "@/types"

export const useResetPropsStore = new Store<useResetFormType>({
    form: {} as useResetFormType['form'],
    checkImages: ''
})