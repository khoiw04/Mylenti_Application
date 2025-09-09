import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import { isTauri } from "@tauri-apps/api/core";
import { AppWindowStore } from "@/store/app-window-store";

export default function useTauriWindow() {
    useEffect(() => {
        if (typeof window !== 'undefined' && isTauri()) {
            const appWindow = getCurrentWindow();
            AppWindowStore.setState(prev => ({ ...prev, appWindow }))
        }
    }, [])
}