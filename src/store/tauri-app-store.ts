import { Store } from "@tanstack/store";
import type { TunnelStatus } from "@/class/CloudflareController";
import type { Window } from "@tauri-apps/api/window";
import type { Update } from "@tauri-apps/plugin-updater";

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

export const tunnelStore = new Store<{status: TunnelStatus}>({
  status: 'idle',
})

export const updateStore = new Store<{
  tracking: string
  allowUpdate: boolean
  percent: string
  updateData: Update | null
}>({
  tracking: '',
  allowUpdate: false,
  percent: '0.00',
  updateData: null,
})