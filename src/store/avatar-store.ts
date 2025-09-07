import { Store } from '@tanstack/store'
import type { Area } from "react-easy-crop"

export const avatarStore = new Store<{
    open: boolean,
    previewImage: string
    croppedImage: string | null
}>({
    open: false,
    previewImage: '',
    croppedImage: null
})

export const cropStore = new Store<{
    zoom: number,
    crop: {
        x: number,
        y: number
    },
    croppedAreaPixels: Area | null,
}>({
    zoom: 1,
    crop: {
        x: 0,
        y: 0
    },
    croppedAreaPixels: null
})