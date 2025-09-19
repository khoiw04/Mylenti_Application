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
}