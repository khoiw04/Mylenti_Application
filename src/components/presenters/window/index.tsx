import { useStore } from '@tanstack/react-store'
import { isTauri } from '@tauri-apps/api/core'
import useWebsocketOBSOverlaySend from "@/components/containers/db.useWebsocketOBSSettingsSend";
import useTauriWindow from '@/components/containers/api.useTauriWindow'
import { AppWindowStore } from '@/store'
import useSyncOBSOverlaySettings, { useInitOBSOverlaySettings } from '@/hooks/useRustOBSSettingsSync'
import useWebSocketSepayAlertSend from '@/components/containers/db.useWebSocketSepayAlertSend'
import useReceiveWebSocket from '@/components/containers/db.useReceiveWebSocketOBS'
import useTheme from '@/components/containers/db.useTheme';

export default function Main() {
    // OBSOVERLAY - SYNC
    useInitOBSOverlaySettings()
    useSyncOBSOverlaySettings()

    // USERSETTING - SYNC
    useTheme()
    
    // Websocket - SEND
    useWebSocketSepayAlertSend()
    useWebsocketOBSOverlaySend()

    // Websocket - RECEIVE
    useReceiveWebSocket()

    useTauriWindow()
    const { appWindow } = useStore(AppWindowStore)
    if (isTauri())

    return (
        <div className="bg-transparent select-none grid grid-cols-[auto_max-content] fixed top-0 left-0 right-0">
            <div data-tauri-drag-region></div>
            <div className="flex flex-row **:px-1.5 **:p-[0.8vmin] *:hover:bg-neutral-300 *:hover:text-neutral-400 *:transition-colors *:first:rounded-bl-md">
                <button onClick={() => appWindow?.minimize()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="20"
                        viewBox="0 0 24 24"
                        className='block'
                    >
                        <path fill="currentColor" d="M19 13H5v-2h14z" />
                    </svg>
                </button>
                <button onClick={() => appWindow?.toggleMaximize()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="20"
                        viewBox="0 0 24 24"
                        className='block'
                    >
                        <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
                    </svg>
                </button>
                <button onClick={() => appWindow?.close()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="20"
                        viewBox="0 0 24 24"
                        className='block'
                    >
                        <path
                        fill="currentColor"
                        d="M13.46 12L19 17.54V19h-1.46L12 13.46L6.46 19H5v-1.46L10.54 12L5 6.46V5h1.46L12 10.54L17.54 5H19v1.46z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}