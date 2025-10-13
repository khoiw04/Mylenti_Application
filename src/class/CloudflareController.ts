import { homeDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { Command } from "@tauri-apps/plugin-shell";
import type { Child } from "@tauri-apps/plugin-shell";

let instance: CloudflareControllerClass | null = null

export class CloudflareControllerClass {
    private process: Child | null = null

    async start(user_name: string) {
        if (this.process) {
            console.warn('This process is working')
            return
        }

        const home = await homeDir();
        const configPath = await join(home, '.cloudflared', `config_${user_name}.yml`);

        await new Promise(resolve => setTimeout(resolve, 6000));

        const fileExists = await exists(configPath);
        if (!fileExists) return

        try {
            this.process = await Command.sidecar('bin/cloudflared', [
                'tunnel',
                '--config',
                configPath,
                'run',
                user_name,
            ]).spawn()
        } catch (err) {
            this.process = null
            console.error('Lỗi khi chạy tunnel:', err);
        }
    }

    async stop() {
        if (!this.process) {
            console.warn('Cloudflare is not running')
            return
        }

        try {
            await this.process.kill()
        } catch (err) {
            console.error('Failed to stop', err)
        } finally {
            this.process = null
        }
    }

    isRunning(): boolean {
        return this.process !== null
    }
}

export function getCloudflareController(): CloudflareControllerClass {
    if (!instance) {
        instance = new CloudflareControllerClass()
    }
    return instance
}

export const CloudflareController = getCloudflareController()