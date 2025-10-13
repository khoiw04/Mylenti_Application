import { cancel, onUrl, start } from '@fabianlars/tauri-plugin-oauth'
import type { OauthConfig} from '@fabianlars/tauri-plugin-oauth';

type OAuthOptions = { onCodeReceived: (code: string) => Promise<void> }

let instance: OAuthServerManagerClass | null = null

export class OAuthServerManagerClass {
    private port: number | null = null

    async init({ ports, response, onCodeReceived }: OauthConfig & OAuthOptions) {
        this.port = await start({ ports, response })

        await onUrl (async (redirectUrl: string) => {
            const urlObj = new URL(redirectUrl)
            const code = urlObj.searchParams.get('code')
            if (code) {
                await onCodeReceived(code)
                await this.cleanup()
            }
        })
    }

    async cleanup() {
        if (this.port !== null) {
            await cancel(this.port)
            this.port = null
        }
    }
}

export function getOAuthServerManager(): OAuthServerManagerClass {
    if (!instance) {
        instance = new OAuthServerManagerClass()
    }
    return instance
}

export const OAuthServerManager = getOAuthServerManager()