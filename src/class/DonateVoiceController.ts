import { Command } from "@tauri-apps/plugin-shell";
import type { Child } from "@tauri-apps/plugin-shell";

export class DonateVoiceControllerClass {
    private process: Child | null = null

    async start() {
        if (this.process) {
            console.warn('donate_voice is already running.')
            return
        }

        try {
            this.process = await Command.sidecar('bin/donate_voice').spawn()
        } catch (err) {
            this.process = null
        }
    }

    async stop() {
        if (!this.process) {
            console.warn('donate_voice is not running.')
            return
        }

        try {
            await this.process.kill()
            console.log('donate_voice stopped.')
        } catch (err) {
            console.error('Failed to stop donate_voice:', err)
        } finally {
            this.process = null
        }
    }

    isRunning(): boolean {
        return this.process !== null
    }
}

export const DonateVoiceController = new DonateVoiceControllerClass()