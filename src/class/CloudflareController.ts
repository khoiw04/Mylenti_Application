import { homeDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { Command } from "@tauri-apps/plugin-shell";
import type { Child } from "@tauri-apps/plugin-shell";
import { tunnelStore } from '@/store';

export type TunnelStatus = 'idle' | 'starting' | 'running' | 'stopping'
let instance: CloudflareControllerClass | null = null

class CloudflareControllerClass {
    private process: Child | null = null
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

    private setStatus(newStatus: TunnelStatus) {
        console.log('[CloudflareController] setStatus:', newStatus)
        this.status = newStatus
        tunnelStore.setState({ status: newStatus })
    }

    async start(user_name: string) {
        if (this.process) {
            console.warn('This process is working')
            return
        }

        const home = await homeDir();
        const configPath = await join(home, '.cloudflared', `config_${user_name}.yml`);
        if (!(await exists(configPath))) {
            console.warn('[CloudflareController] Config file not found:', configPath)
            return
        }
        
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

function getCloudflareController(): CloudflareControllerClass {
    if (!instance) {
        instance = new CloudflareControllerClass()
    }
    return instance
}


export const CloudflareController = getCloudflareController()