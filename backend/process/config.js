const dotenv = require('dotenv')
const { commander } = require('./commander')
const { mode } = commander.opts()

dotenv.config({
    path: mode === 'development' ? './.env.dev' : './.env.prod'
})

const port = process.env.PORT

module.exports = {
    port,
}
