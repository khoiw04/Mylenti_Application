import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { AppWindowStore } from "@/store";
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";
import useSQLiteDiscordInfo from "@/hooks/useSQLiteDiscordInfo";
import { CloudflareController } from "@/class/CloudflareController";
import { AutoUpdateTauriManager } from "@/class/AutoUpdateTauriManager";

export default function useTauriInit() {
    const { data: { user_name } } = useSQLiteDiscordInfo()

    useTauriSafeEffect(() => {
        const appWindow = getCurrentWindow();
        AppWindowStore.setState(prev => ({ ...prev, appWindow }))
    }, [])

    useTauriSafeEffect(() => {
        function sendLog(level: "error" | "warn" | "info", message: string, source?: string, lineno?: number, colno?: number) {
            invoke("log_frontend", {
                level,
                message,
                source: source || null,
                lineno: lineno || null,
                colno: colno || null,
            });
        }

        const originalWarn = console.warn;
        const originalInfo = console.info;

        console.warn = function (...args) {
            invoke("log_frontend", {
                level: "warn",
                message: args.join(" "),
                source: null,
                lineno: null,
                colno: null,
            });

            originalWarn(...args);
        };

        console.info = function (...args) {
            invoke("log_frontend", {
                level: "info",
                message: args.join(" "),
                source: null,
                lineno: null,
                colno: null,
            });

            originalInfo(...args);
        };
        
        window.onerror = function (message, source, lineno, colno) {
            sendLog("error", String(message), source, lineno, colno);
        };

        window.onunhandledrejection = function (event) {
            sendLog("error", String(event.reason));
        };
    }, [])

    useTauriSafeEffect(() => {
        if (!user_name) return;
        (async () => await CloudflareController.start(user_name))
    }, [user_name]);

    useTauriSafeEffect(() => {
        (async () => await AutoUpdateTauriManager.init())
    }, [])
}