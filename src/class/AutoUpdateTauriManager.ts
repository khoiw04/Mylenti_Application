import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import type { Update } from "@tauri-apps/plugin-updater";
import { updateStore } from "@/store";

export class AutoUpdateTauriManagerClass {
    private updateData: Update | null = null
    private tracking = ''
    private percent = 0

    private setState() {
        updateStore.setState(prev => ({
            ...prev,
            tracking: this.tracking,
            percent: this.percent.toFixed(2),
            updateData: this.updateData
        }))
    }

    async init() {
        this.updateData = await check()
        this.setState()
    }

    async update() {
        if (this.updateData) {
            let downloaded = 0;
            let contentLength = 0;

            await this.updateData.downloadAndInstall((event) => {
                switch (event.event) {
                    case 'Started':
                        contentLength = event.data.contentLength!;
                        break;
                    case 'Progress': {
                        downloaded += event.data.chunkLength;
                        const percent = ((downloaded / contentLength) * 100);
                        this.tracking = `${downloaded} / ${contentLength} bytes`,
                        this.percent = percent
                        this.setState()
                        break;
                    }
                }
            });

            await relaunch()
            return () => this.updateData?.close()
        }
    }
}

export const AutoUpdateTauriManager = new AutoUpdateTauriManagerClass