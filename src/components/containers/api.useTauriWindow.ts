import { getCurrentWindow } from "@tauri-apps/api/window";
import { AppWindowStore } from "@/store";
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";

export default function useTauriWindow() {
    useTauriSafeEffect(() => {
        const appWindow = getCurrentWindow();
        AppWindowStore.setState(prev => ({ ...prev, appWindow }))
    }, [])
}