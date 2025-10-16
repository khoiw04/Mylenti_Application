import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import type { Update } from "@tauri-apps/plugin-updater";

export class AutoUpdateTauriManagerClass {
    private updateData: Update | null = null
    private allowUpdate = false
    private tracking = ''
    private percent = 0

    async init() {
        this.updateData = await check()
    }

    async update() {
        if (this.updateData && this.allowUpdate) {
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
                        break;
                    }
                }
            });

            await relaunch()
            return () => this.updateData?.close()
        }
    }

    getData() {
        return {
            tracking: this.tracking,
            allowUpdate: this.allowUpdate,
            percent: this.percent.toFixed(2),
            updateData: this.updateData
        }
    }

    setUpdate(boolean: boolean) {
        this.allowUpdate = boolean
    }
}

export const AutoUpdateTauriManager = new AutoUpdateTauriManagerClass