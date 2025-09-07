import { useStore } from "@tanstack/react-store"
import Select from "./Search";
import { OBSOverlayState, OBSOverlayStateStragery } from "@/store/obs-overlay-store"
import { presets } from "@/data/obs-overlay";

export default function Preset() {
    const { openPreset, valuePreset } = useStore(OBSOverlayState)
    const { openPresetStragery, valuePresetStragery } = useStore(OBSOverlayStateStragery)

    return <Select 
        array={presets}
        open={openPreset}
        value={valuePreset}
        onValueChange={valuePresetStragery}
        onOpenChange={openPresetStragery}
    />
}