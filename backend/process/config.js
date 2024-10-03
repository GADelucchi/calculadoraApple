const dotenv = require('dotenv')
const { commander } = require('./commander')
const { mode } = commander.opts()

dotenv.config({
    path: mode === 'development' ? './.env.dev' : './.env.prod'
})

const port = process.env.PORT
const mailUser = process.env.MAIL_USER
const mailPass = process.env.MAIL_PASS
const server = process.env.SERVER
const smtp_port = process.env.SMTP_PORT
const mailReceiver = process.env.MAIL_RECEIVER

module.exports = {
    port,
    mailUser,
    mailPass,
    server,
    smtp_port,
    mailReceiver
}
