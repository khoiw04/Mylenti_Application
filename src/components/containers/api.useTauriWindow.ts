import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { AppWindowStore } from "@/store";
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";

export default function useTauriWindow() {
    useTauriSafeEffect(() => {
        const appWindow = getCurrentWindow();
        AppWindowStore.setState(prev => ({ ...prev, appWindow }))
    }, [])

    useTauriSafeEffect(() => {
        invoke<string>("ping")
            .then((response) => {
                toast.message(`Invoke success: ${response}`);
            })
            .catch((err) => {
                toast.error(`❌ Invoke failed: ${err}`);
            });
    }, []);
}