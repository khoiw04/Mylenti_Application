import { useStore } from "@tanstack/react-store"
import { IndexState } from "@/store/index-store"

export default function Footer() {
    const { finishGoogleOBSAuth } = useStore(IndexState)

    if (!finishGoogleOBSAuth) return null
    return null
}