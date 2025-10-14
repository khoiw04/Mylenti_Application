import { homeDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { Command } from "@tauri-apps/plugin-shell";
import mitt from 'mitt'
import type { Child } from "@tauri-apps/plugin-shell";

let instance: CloudflareControllerClass | null = null
export type TunnelStatus = 'idle' | 'starting' | 'running' | 'stopping'
type Events = { statusChange: TunnelStatus }

export class CloudflareControllerClass {
    private process: Child | null = null
    private emitter = mitt<Events>()
    private status: TunnelStatus = 'idle'
    private pollingInterval: ReturnType<typeof setInterval> | null = null

    private startPolling() {
        if (this.pollingInterval) return
        this.pollingInterval = setInterval(() => {
            if (this.process === null && this.status === 'running') {
                this.setStatus('idle')
                this.stopPolling()
            }
        }, 2000)
    }

    private stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval)
            this.pollingInterval = null
        }
    }
    onStatusChange(cb: (running: TunnelStatus) => void) {
        this.emitter.on('statusChange', cb)
    }

    offStatusChange(cb: (running: TunnelStatus) => void) {
        this.emitter.off('statusChange', cb)
    }

    private setStatus(newStatus: TunnelStatus) {
        this.status = newStatus
        this.emitter.emit('statusChange', newStatus)
    }

    async start(user_name: string) {
        if (this.process) {
            console.warn('This process is working')
            return
        }

        const home = await homeDir();
        const configPath = await join(home, '.cloudflared', `config_${user_name}.yml`);
        if (!(await exists(configPath))) return
        
        try {
            this.setStatus('starting')
            this.process = await Command.sidecar('bin/cloudflared', [
                'tunnel',
                '--config',
                configPath,
                'run',
                user_name,
            ]).spawn()

            this.setStatus('running')
            this.startPolling()
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
            this.setStatus('stopping')
            await this.process.kill()
            this.process = null
            this.setStatus('idle')
            this.stopPolling()
        } catch (err) {
            console.error('Failed to stop', err)
        } finally {
            this.process = null
            this.setStatus('idle')
            this.stopPolling()
        }
    }

    getStatus(): TunnelStatus {
        return this.status
    }

    isRunning(): boolean {
        return this.status === 'running'
    }
}

export function getCloudflareController(): CloudflareControllerClass {
    if (!instance) {
        instance = new CloudflareControllerClass()
    }
    return instance
}

export const CloudflareController = getCloudflareController()