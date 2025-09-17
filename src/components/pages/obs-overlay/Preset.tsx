import { useStore } from "@tanstack/react-store"
import Select from "./Search";
import { OBSOverlaySettingStragery, OBSOverlayTauriSettingsProps } from "@/store"
import { presetUserVariants } from "@/data/obs-overlay";

export default function Preset() {
    const { currentPreset, openStatePreset } = useStore(OBSOverlayTauriSettingsProps)
    const { currentPresetStragery, openStatePresetStragery } = useStore(OBSOverlaySettingStragery)

    return <Select
        value={currentPreset}
        open={openStatePreset}
        selectArray={presetUserVariants}
        onValueChange={currentPresetStragery}
        onOpenChange={openStatePresetStragery}
    />
}