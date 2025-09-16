import { Store } from "@tanstack/store";
import type { Window } from "@tauri-apps/api/window";

export const AppWindowStore = new Store<{
    appWindow: Window | null
}>({
    appWindow: null
})