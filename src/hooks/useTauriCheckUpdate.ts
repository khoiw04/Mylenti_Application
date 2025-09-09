import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { listen } from '@tauri-apps/api/event';

export async function useTauriDownloadUpdate() {
    const update = await check()
    if (update) {
        listen<number>('update_progress', (event) => {
            console.log(`Tiến trình: ${event.payload.toFixed(2)}%`);
        })
        listen<number>('download_speed', (event) => {
            console.log(`Tiến trình: ${event.payload}`);
        })
        await relaunch();
    }
}