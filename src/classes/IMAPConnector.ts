import {IMAPConfiguration} from "../interfaces/IMAPConfiguration"

const {ImapFlow} = require('imapflow')


export class IMAPConnector {
    private readonly configs: IMAPConfiguration
    private client: any

    constructor(configs: IMAPConfiguration) {
        this.configs = configs
        const {username, password, hostname, port, security} = this.configs

        this.client = new ImapFlow({
            host: hostname,
            port,
            secure: security === 'ssl_tls',
            auth: {
                user: username,
                pass: password
            },
            logger: false
        })
    }

    private async _withTransaction<Result>(func: Function): Promise<Result> {
        await this.client.connect()
        console.log('connected!')
        let lock = await this.client.getMailboxLock('INBOX')
        let r: Result

        try {
            r = await func()
            console.log('r:', r)
        } finally {
            lock.release()
        }

        await this.client.logout()

        return r
    }

    public async test(): Promise<Boolean> {
        console.log('try to connect...')
        await this.client.connect()
        let lock = await this.client.getMailboxLock('INBOX')
        lock.release()
        await this.client.logout()
        console.log('connected!')

        return true
    }

    public async stats(): Promise<Record<string, any>> {
        return this._withTransaction<Record<string, any>>(async () => {
            const {exists, unseen} = this.client.mailbox

            return {
                exists: exists ? parseInt(exists, 10) : null,
                unseen: unseen ? parseInt(unseen, 10) : null
            }
        })
    }
}

