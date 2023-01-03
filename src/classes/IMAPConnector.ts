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

    public async test(): Promise<Boolean> {
        console.log('try to connect...')
        await this.client.connect()

        let lock = await this.client.getMailboxLock('INBOX')
        console.log('MAILBOX', this.client.mailbox)

        lock.release()
        await this.client.logout()
        console.log('connected!')

        return true
    }
}

