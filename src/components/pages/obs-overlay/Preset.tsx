import { useStore } from "@tanstack/react-store"
import Select from "./Search";
import { OBSOverlaySettingStragery, OBSOverlaySettingsProps } from "@/store/obs-overlay-store"
import { presetUserVariants } from "@/data/obs-overlay";

export default function Preset() {
    const { currentPreset, openStatePreset } = useStore(OBSOverlaySettingsProps)
    const { currentPresetStragery, openStatePresetStragery } = useStore(OBSOverlaySettingStragery)

    return <Select
        value={currentPreset}
        open={openStatePreset}
        selectArray={presetUserVariants}
        onValueChange={currentPresetStragery}
        onOpenChange={openStatePresetStragery}
    />
}