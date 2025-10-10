import { Store } from "@tanstack/store";
import type { Child } from "@tauri-apps/plugin-shell";
import type { Window } from "@tauri-apps/api/window";

export const AppWindowStore = new Store<{
    appWindow: Window | null
}>({
    appWindow: null
})

export const ThemeStore = new Store<{
    theme: "light" | "dark" | null,
    setTheme: (theme: "light" | "dark") => void
}>({
    theme: null,
    setTheme: (theme) => 
        ThemeStore.setState(prev => ({
            ...prev,
            theme: theme
        }))
})

export const tunnelProcessStore = new Store<{
    tunnelProcess: Child | null
}>({
    tunnelProcess: null
})