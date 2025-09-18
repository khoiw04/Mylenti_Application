import { useStore } from "@tanstack/react-store"
import Select from "./Search";
import { OBSOverlayTauriSettingStragery, OBSOverlayTauriSettingsProps } from "@/store"
import { presetUserVariants } from "@/data/obs-overlay";

export default function Preset() {
    const { currentPreset, openStatePreset } = useStore(OBSOverlayTauriSettingsProps)
    const { currentPresetStragery, openStatePresetStragery } = useStore(OBSOverlayTauriSettingStragery)

    return <Select
        value={currentPreset}
        open={openStatePreset}
        selectArray={presetUserVariants}
        onValueChange={currentPresetStragery}
        onOpenChange={openStatePresetStragery}
    />
}