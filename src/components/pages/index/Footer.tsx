import { useStore } from "@tanstack/react-store"
import GoogleLogOutButton from "./GoogleLogOutButton"
import DonateOverlayButton from "./DonateOverlayButton"
import FullScreenButton from "./FullScreenButton"
import { IndexState } from "@/store"

export default function Footer() {
    const { finishGoogleOBSAuth } = useStore(IndexState)

    if (!finishGoogleOBSAuth) return null
    return (
        <footer className="absolute w-full flex justify-between items-center bottom-5 px-8">
            <DonateOverlayButton />
            <FullScreenButton />
            <GoogleLogOutButton />
        </footer>
    )
}