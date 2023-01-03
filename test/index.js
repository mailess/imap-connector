require('dotenv').config({
    path: require('path').join(__dirname, '.env')
})

const {IMAPConnector} = require('../dist')

setImmediate(async () => {
    try {
        const imap = new IMAPConnector({
            hostname: 'outlook.office365.com',
            port: 993,
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            security: 'ssl_tls'
        })

        await imap.test()
    } catch (error) {
        console.error('ERROR', error)
    }
})

